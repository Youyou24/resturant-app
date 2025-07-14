import { useCallback, useState } from 'react';

export interface CartItem {
  name: string;
  price: number;
  image: any;
  quantity: number;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((name: string) => {
    setCart((prev) => prev.filter((i) => i.name !== name));
  }, []);

  const updateQuantity = useCallback((name: string, quantity: number) => {
    setCart((prev) =>
      prev.map((i) =>
        i.name === name ? { ...i, quantity: Math.max(1, quantity) } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // Ajoute plusieurs articles d'un coup (pour répéter une commande)
  const addManyToCart = useCallback((items: CartItem[]) => {
    setCart((prev) => {
      let updated = [...prev];
      items.forEach((item) => {
        const existing = updated.find((i) => i.name === item.name);
        if (existing) {
          updated = updated.map((i) =>
            i.name === item.name ? { ...i, quantity: i.quantity + item.quantity } : i
          );
        } else {
          updated.push({ ...item });
        }
      });
      return updated;
    });
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return { cart, addToCart, addManyToCart, removeFromCart, updateQuantity, clearCart, total };
} 