import { useOrders } from '@/hooks/useOrders';
import { Link } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function OrdersScreen() {
  const { orders, loading } = useOrders();

  if (loading) {
    return <View style={styles.container}><Text>Chargement...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historique des commandes</Text>
      {orders.length === 0 ? (
        <Text style={styles.empty}>Aucune commande passée.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Link href={`/orders/${item.id}`} asChild>
              <TouchableOpacity style={styles.order}>
                <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
                <Text style={styles.total}>Total : {item.total.toFixed(2)} €</Text>
                <Text style={styles.items}>{item.items.length} article(s)</Text>
                <Text style={styles.detailLink}>Voir le détail</Text>
              </TouchableOpacity>
            </Link>
          )}
        />
      )}
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    alignSelf: 'center',
  },
  empty: {
    fontSize: 18,
    color: '#888',
    alignSelf: 'center',
  },
  order: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    marginBottom: 16,
    padding: 14,
    elevation: 1,
  },
  date: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  total: {
    color: '#1D3D47',
    marginBottom: 2,
  },
  items: {
    color: '#555',
  },
  detailLink: {
    color: '#0a7ea4',
    marginTop: 6,
    fontWeight: 'bold',
  },
}); 