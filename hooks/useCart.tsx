"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import type { SizeLabel, ShoeSizeLabel, FitType } from "@/data/sizes";

/** Maximum quantity per cart line — must match the server-side MAX_QTY exactly. */
export const MAX_QTY = 10;

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  /** Unique key: productId + fit + size */
  key:          string;
  productId:    string;
  productTitle: string;
  productImage: string;
  category:     string;
  fit:          FitType | "Standard";
  size:         SizeLabel | ShoeSizeLabel;
  quantity:     number;
  unitPrice:    number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD";    item: CartItem }
  | { type: "REMOVE"; key: string }
  | { type: "UPDATE_QTY"; key: string; quantity: number }
  | { type: "CLEAR" };

interface CartContextValue extends CartState {
  addItem:        (item: Omit<CartItem, "key">) => void;
  removeItem:     (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart:      () => void;
  totalItems:     number;
  totalPrice:     number;
}

// ── Reducer ───────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.key === action.item.key);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.key === action.item.key
              ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + action.item.quantity) }
              : i
          ),
        };
      }
      return { items: [...state.items, { ...action.item, quantity: Math.min(MAX_QTY, action.item.quantity) }] };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.key !== action.key) };
    case "UPDATE_QTY":
      return {
        items: state.items.map((i) =>
          i.key === action.key
            ? { ...i, quantity: Math.max(1, Math.min(MAX_QTY, action.quantity)) }
            : i
        ),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "tailorobe_cart";

function loadPersistedCart(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as CartState;
  } catch { /* ignore */ }
  return { items: [] };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadPersistedCart);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addItem = (item: Omit<CartItem, "key">) => {
    const key = `${item.productId}__${item.fit}__${item.size}`;
    dispatch({ type: "ADD", item: { ...item, key } });
  };

  const removeItem     = (key: string) => dispatch({ type: "REMOVE", key });
  const updateQuantity = (key: string, quantity: number) => dispatch({ type: "UPDATE_QTY", key, quantity });
  const clearCart      = () => dispatch({ type: "CLEAR" });

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = state.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
