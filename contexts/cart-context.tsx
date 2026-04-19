"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import type { CartItem, Cart } from "@/lib/types";
import { MAX_CART_QUANTITY, STORAGE_CART_KEY } from "@/lib/constants";

interface CartContextType {
  cart: Cart;
  addToCart: (item: Omit<CartItem, "totalPrice">) => void;
  removeFromCart: (variantId: number) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (variantId: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const defaultCart: Cart = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

function calculateTotals(items: CartItem[]): { totalItems: number; totalPrice: number } {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
  return { totalItems, totalPrice };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(defaultCart);
  const hasHydrated = useRef(false);

  useEffect(() => {
    const savedCart = window.localStorage.getItem(STORAGE_CART_KEY);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("[cart] failed to parse cart from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    hasHydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) return;
    window.localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((item: Omit<CartItem, "totalPrice">) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.items.findIndex(
        (i) => i.variantId === item.variantId
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        newItems = [...prevCart.items];
        const existingItem = newItems[existingItemIndex];
        if (existingItem) {
          const newQuantity = Math.min(
            existingItem.quantity + item.quantity,
            MAX_CART_QUANTITY
          );
          newItems[existingItemIndex] = {
            ...existingItem,
            quantity: newQuantity,
            totalPrice: newQuantity * item.unitPrice,
          };
        }
      } else {
        const newItem: CartItem = {
          ...item,
          totalPrice: item.quantity * item.unitPrice,
        };
        newItems = [...prevCart.items, newItem];
      }

      return { items: newItems, ...calculateTotals(newItems) };
    });
  }, []);

  const removeFromCart = useCallback((variantId: number) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter((item) => item.variantId !== variantId);
      return { items: newItems, ...calculateTotals(newItems) };
    });
  }, []);

  const updateQuantity = useCallback((variantId: number, quantity: number) => {
    if (quantity <= 0) {
      setCart((prevCart) => {
        const newItems = prevCart.items.filter((item) => item.variantId !== variantId);
        return { items: newItems, ...calculateTotals(newItems) };
      });
      return;
    }

    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) => {
        if (item.variantId === variantId) {
          const newQuantity = Math.min(quantity, MAX_CART_QUANTITY);
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: newQuantity * item.unitPrice,
          };
        }
        return item;
      });
      return { items: newItems, ...calculateTotals(newItems) };
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart(defaultCart);
  }, []);

  const getItemQuantity = useCallback(
    (variantId: number): number => {
      return cart.items.find((i) => i.variantId === variantId)?.quantity || 0;
    },
    [cart.items]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
