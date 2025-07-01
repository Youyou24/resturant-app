import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function CartScreen() {
  // Exemple de structure de panier (à remplacer par des données dynamiques plus tard)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Votre panier</Text>
      <Text style={styles.empty}>Le panier est vide.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  empty: {
    fontSize: 18,
    color: '#888',
  },
}); 