import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AdminScreen() {
  // Exemple de structure admin (à remplacer par des fonctionnalités réelles plus tard)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Espace Administration</Text>
      <Text style={styles.info}>Options de gestion à venir...</Text>
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
  info: {
    fontSize: 18,
    color: '#888',
  },
}); 