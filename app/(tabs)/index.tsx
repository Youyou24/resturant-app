import { Image } from 'expo-image';
import { Animated, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { DishCard } from '@/components/DishCard';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCart } from '@/hooks/useCart';
import { useDishes } from '@/hooks/useDishes';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';

const MENU = [
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

export default function HomeScreen() {
  const { addToCart } = useCart();
  const { dishes, favorites, toggleFavorite, loading } = useDishes();
  const [showNotif, setShowNotif] = useState(false);
  const [notifAnim] = useState(new Animated.Value(0));

  const handleAddToCart = (dish: { name: string; price: number; image: any }) => {
    addToCart(dish);
    setShowNotif(true);
    Animated.timing(notifAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(notifAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => setShowNotif(false));
      }, 1200);
    });
  };

  if (loading) {
    return <View style={styles.center}><Text>Chargement...</Text></View>;
  }

  // Séparer favoris et autres plats
  const favDishes = dishes.filter(d => favorites.includes(d.name));
  const otherDishes = dishes.filter(d => !favorites.includes(d.name));

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Bienvenue au Restaurant !</ThemedText>
        <HelloWave />
      </ThemedView>

      {/* Section Favoris */}
      {favDishes.length > 0 && (
        <ThemedView style={styles.sectionContainer}>
          <ThemedText type="subtitle">Vos favoris</ThemedText>
          <View style={{ marginTop: 12 }}>
            {favDishes.map((dish, idx) => (
              <View key={dish.name + idx} style={styles.favRow}>
                <DishCard
                  name={dish.name}
                  description={dish.description}
                  price={dish.price}
                  image={dish.image}
                  onAddToCart={() => handleAddToCart(dish)}
                />
                <TouchableOpacity onPress={() => toggleFavorite(dish.name)} style={styles.favIcon}>
                  <FontAwesome name="star" size={28} color="#FFD700" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ThemedView>
      )}

      {/* Section Menu */}
      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">Menu</ThemedText>
        <ThemedText>Découvrez nos plats délicieux et variés, préparés avec des ingrédients frais.</ThemedText>
        <View style={{ marginTop: 12 }}>
          {otherDishes.map((dish, idx) => (
            <View key={dish.name + idx} style={styles.favRow}>
              <DishCard
                name={dish.name}
                description={dish.description}
                price={dish.price}
                image={dish.image}
                onAddToCart={() => handleAddToCart(dish)}
              />
              <TouchableOpacity onPress={() => toggleFavorite(dish.name)} style={styles.favIcon}>
                <FontAwesome name={favorites.includes(dish.name) ? 'star' : 'star-o'} size={28} color="#FFD700" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ThemedView>
      {/* Notification Snackbar */}
      {showNotif && (
        <Animated.View style={[styles.snackbar, { opacity: notifAnim, transform: [{ translateY: notifAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }] }] }>
          <Text style={styles.snackbarText}>Ajouté au panier !</Text>
        </Animated.View>
      )}

      {/* Section Promotions */}
      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">Promotions</ThemedText>
        <ThemedText>Profitez de nos offres spéciales du moment et économisez sur vos plats préférés !</ThemedText>
        <View style={styles.buttonContainer}>
          <Button title="Voir les promotions" onPress={() => { /* Navigation à venir */ }} />
        </View>
      </ThemedView>

      {/* Section À propos */}
      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">À propos</ThemedText>
        <ThemedText>Notre restaurant vous accueille dans une ambiance chaleureuse et conviviale. Venez vivre une expérience culinaire unique !</ThemedText>
      </ThemedView>

      {/* Section Contact */}
      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">Contact & Réservations</ThemedText>
        <ThemedText>Contactez-nous pour réserver une table ou pour toute question.</ThemedText>
        <View style={styles.buttonContainer}>
          <Button title="Nous contacter" onPress={() => { /* Navigation à venir */ }} />
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionContainer: {
    gap: 8,
    marginBottom: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  buttonContainer: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  snackbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 30,
    marginHorizontal: 32,
    backgroundColor: '#1D3D47',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    zIndex: 100,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  snackbarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  favRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  favIcon: {
    marginLeft: 8,
    padding: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
