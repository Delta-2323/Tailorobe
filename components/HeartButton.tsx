"use client";

import { Heart } from "lucide-react";

interface HeartButtonProps {
  productId: string;
  liked: boolean;
  onToggle: (productId: string) => void;
  className?: string;
}

/**
 * Heart/favourite toggle. Freely toggleable on the website.
 * Outlined when unliked → filled red when liked.
 */
export function HeartButton({ productId, liked, onToggle, className }: HeartButtonProps) {
  return (
    <button
      type="button"
      aria-label={liked ? "Remove from favourites" : "Add to favourites"}
      aria-pressed={liked}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle(productId);
      }}
      className={[
        "flex h-9 w-9 items-center justify-center rounded-full",
        "border border-white/60 bg-white/80 shadow-sm backdrop-blur-sm",
        "transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400",
        liked ? "border-red-200 bg-red-50/90" : "",
        className ?? "",
      ].join(" ").trim()}
    >
      <Heart
        size={15}
        className={
          liked
            ? "fill-red-500 stroke-red-500 transition-all duration-200"
            : "fill-transparent stroke-muted-foreground transition-all duration-200 hover:stroke-red-400"
        }
      />
    </button>
  );
}
