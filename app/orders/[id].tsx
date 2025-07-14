import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders } = useOrders();
  const { addManyToCart } = useCart();
  const router = useRouter();

  const order = orders.find((o) => o.id === id);

  const handleRepeat = () => {
    if (order) {
      addManyToCart(order.items);
      Alert.alert('Commande répétée', 'Les articles ont été ajoutés au panier.');
    }
  };

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Commande introuvable</Text>
        <Button title="Retour" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Détail de la commande</Text>
      <Text style={styles.date}>Date : {new Date(order.date).toLocaleString()}</Text>
      <Text style={styles.total}>Total : {order.total.toFixed(2)} €</Text>
      <Text style={styles.subtitle}>Articles :</Text>
      <FlatList
        data={order.items}
        keyExtractor={(item, idx) => item.name + idx}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text>Quantité : {item.quantity}</Text>
            <Text>Prix unitaire : {item.price.toFixed(2)} €</Text>
            <Text>Sous-total : {(item.price * item.quantity).toFixed(2)} €</Text>
          </View>
        )}
      />
      <Button title="Répéter cette commande" onPress={handleRepeat} />
      <View style={{ height: 12 }} />
      <Button title="Retour" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center',
  },
  date: {
    marginBottom: 6,
    color: '#555',
  },
  total: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1D3D47',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  item: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  itemName: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
}); 