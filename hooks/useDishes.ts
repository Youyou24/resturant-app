import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

export interface Dish {
  name: string;
  description: string;
  price: number;
  image: any;
}

const STORAGE_KEY = 'dishes';
const FAVORITES_KEY = 'dish_favorites';

const defaultDishes: Dish[] = [
  {
    name: 'Burger Maison',
    description: 'Un délicieux burger avec steak frais, fromage fondant et légumes croquants.',
    price: 12.5,
    image: require('@/assets/images/burger.jpg'),
  },
  {
    name: 'Salade Fraîcheur',
    description: 'Mélange de légumes frais, vinaigrette maison, parfait pour l’été.',
    price: 9.0,
    image: require('@/assets/images/salad.jpg'),
  },
  {
    name: 'Dessert Gourmand',
    description: 'Un dessert sucré pour finir votre repas en beauté.',
    price: 6.0,
    image: require('@/assets/images/dessert.jpg'),
  },
];

export function useDishes() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Charger les plats au démarrage
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((data) => {
        if (data) {
          setDishes(JSON.parse(data));
        } else {
          setDishes(defaultDishes);
          AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDishes));
        }
      })
      .finally(() => setLoading(false));
    // Charger les favoris
    AsyncStorage.getItem(FAVORITES_KEY).then((data) => {
      if (data) setFavorites(JSON.parse(data));
    });
  }, []);

  // Ajouter un plat
  const addDish = useCallback(async (dish: Dish) => {
    const updated = [...dishes, dish];
    setDishes(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [dishes]);

  // Modifier un plat (par index)
  const editDish = useCallback(async (index: number, dish: Dish) => {
    const updated = [...dishes];
    updated[index] = dish;
    setDishes(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [dishes]);

  // Supprimer un plat (par index)
  const deleteDish = useCallback(async (index: number) => {
    const updated = dishes.filter((_, i) => i !== index);
    setDishes(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [dishes]);

  // Ajouter/retirer un favori
  const toggleFavorite = useCallback(async (dishName: string) => {
    let updated: string[];
    if (favorites.includes(dishName)) {
      updated = favorites.filter((n) => n !== dishName);
    } else {
      updated = [...favorites, dishName];
    }
    setFavorites(updated);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  }, [favorites]);

  return { dishes, addDish, editDish, deleteDish, loading, favorites, toggleFavorite };
} 