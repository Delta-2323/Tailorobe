"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// ─── localStorage keys ────────────────────────────────────────────────────────

const DEVICE_ID_KEY = "tailorobe_device_id";
const LIKED_KEY     = "tailorobe_liked_products";

// ─── Device ID ────────────────────────────────────────────────────────────────

function getOrCreateDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

// ─── Device info ─────────────────────────────────────────────────────────────

function getDeviceInfo() {
  return {
    user_agent:    navigator.userAgent,
    language:      navigator.language,
    timezone:      Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen_width:  window.screen.width,
    screen_height: window.screen.height,
  };
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

function readLocalLikes(): Set<string> {
  try {
    const raw = localStorage.getItem(LIKED_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return new Set<string>(parsed);
  } catch { /* corrupted — start fresh */ }
  return new Set();
}

function writeLocalLikes(liked: Set<string>): void {
  try {
    localStorage.setItem(LIKED_KEY, JSON.stringify(Array.from(liked)));
  } catch { /* quota exceeded — silently ignore */ }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseLikedProductsReturn {
  /** Returns true if the product is currently liked */
  isLiked: (productId: string) => boolean;
  /**
   * Toggle like/unlike on the website.
   * Always inserts a new row in the database — rows are never deleted.
   */
  toggle: (productId: string, productName: string) => void;
  /** Total number of currently liked products */
  likedCount: number;
  /** True while the initial Supabase fetch is in progress */
  loading: boolean;
}

/**
 * Manages liked products with Supabase as the source of truth.
 *
 * - Website: users can like and unlike freely.
 * - Database: every action inserts a new row with action='like' or 'unlike'.
 *   Rows are never deleted — it's an immutable audit log.
 * - Current state is determined by the most recent action per product.
 * - localStorage is kept in sync as an offline fallback.
 */
export function useLikedProducts(): UseLikedProductsReturn {
  const [liked, setLiked]     = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // On mount: fetch current liked state from Supabase (latest action per product)
  useEffect(() => {
    let cancelled = false;

    async function loadLikes() {
      const deviceId = getOrCreateDeviceId();

      if (supabase) {
        try {
          // Get the most recent action for each product this device has touched
          const { data, error } = await supabase
            .from("product_likes")
            .select("product_id, action, created_at")
            .eq("device_id", deviceId)
            .order("created_at", { ascending: false });

          if (cancelled) return;
          if (error) throw error;

          // Latest action per product_id determines current state
          const seen = new Set<string>();
          const currentlyLiked = new Set<string>();

          for (const row of data as { product_id: string; action: string }[]) {
            if (!seen.has(row.product_id)) {
              seen.add(row.product_id);
              if (row.action === "like") currentlyLiked.add(row.product_id);
            }
          }

          setLiked(currentlyLiked);
          writeLocalLikes(currentlyLiked);
          setLoading(false);
          return;
        } catch {
          // Supabase unavailable — fall through to localStorage
        }
      }

      if (!cancelled) {
        setLiked(readLocalLikes());
        setLoading(false);
      }
    }

    loadLikes();
    return () => { cancelled = true; };
  }, []);

  const toggle = useCallback(async (productId: string, productName: string) => {
    const isCurrentlyLiked = liked.has(productId);
    const action = isCurrentlyLiked ? "unlike" : "like";
    const deviceId = getOrCreateDeviceId();

    // Optimistic UI update
    setLiked((prev) => {
      const next = new Set(prev);
      if (isCurrentlyLiked) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      writeLocalLikes(next);
      return next;
    });

    // Always INSERT — never delete. Full history preserved in the database.
    if (supabase) {
      try {
        await supabase.from("product_likes").insert({
          device_id:    deviceId,
          product_id:   productId,
          product_name: productName,
          action,
          ...getDeviceInfo(),
        });
      } catch {
        // Supabase write failed — localStorage already updated as fallback
      }
    }
  }, [liked]);

  const isLiked = useCallback(
    (productId: string) => liked.has(productId),
    [liked]
  );

  return { isLiked, toggle, likedCount: liked.size, loading };
}
