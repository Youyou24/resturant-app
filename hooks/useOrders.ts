import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import type { CartItem } from './useCart';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string; // ISO string
}

const STORAGE_KEY = 'orders';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les commandes au démarrage
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((data: string | null) => {
        if (data) {
          setOrders(JSON.parse(data));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Ajouter une commande
  const addOrder = useCallback(async (order: Omit<Order, 'id' | 'date'>) => {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    const updated = [newOrder, ...orders];
    setOrders(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [orders]);

  // Effacer l'historique (optionnel)
  const clearOrders = useCallback(async () => {
    setOrders([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  return { orders, addOrder, clearOrders, loading };
} 