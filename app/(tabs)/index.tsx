import { Image } from 'expo-image';
import { Button, StyleSheet, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
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

      {/* Section Menu */}
      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">Menu</ThemedText>
        <ThemedText>Découvrez nos plats délicieux et variés, préparés avec des ingrédients frais.</ThemedText>
        <View style={styles.buttonContainer}>
          <Button title="Voir le menu" onPress={() => { /* Navigation à venir */ }} />
        </View>
      </ThemedView>

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
});
