import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React, { useEffect } from 'react';
import { Alert, Button, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CartScreen() {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { addOrder } = useOrders();

  useEffect(() => {
    // Demander la permission pour les notifications au montage
    (async () => {
      if (Device.isDevice) {
        await Notifications.requestPermissionsAsync();
      }
    })();
  }, []);

  const handleOrder = async () => {
    if (cart.length === 0) return;
    try {
      await addOrder({ items: cart, total });
      // Notification locale
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Commande validée',
          body: `Votre commande de ${cart.length} article(s) a bien été prise en compte !`,
        },
        trigger: null,
      });
      Alert.alert(
        'Commande',
        'Votre commande a bien été prise en compte !\nVoulez-vous vider le panier ?',
        [
          { text: 'Non', style: 'cancel' },
          { text: 'Oui', style: 'destructive', onPress: () => clearCart() },
        ]
      );
    } catch (e) {
      Alert.alert('Erreur', "Impossible d'enregistrer la commande.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Votre panier</Text>
      {cart.length === 0 ? (
        <Text style={styles.empty}>Le panier est vide.</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Image source={item.image} style={styles.image} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>{item.price.toFixed(2)} €</Text>
                  <View style={styles.qtyRow}>
                    <TouchableOpacity onPress={() => updateQuantity(item.name, item.quantity - 1)} style={styles.qtyBtn}>
                      <Text style={styles.qtyBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qty}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => updateQuantity(item.name, item.quantity + 1)} style={styles.qtyBtn}>
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item.name)} style={styles.removeBtn}>
                  <Text style={styles.removeBtnText}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <Text style={styles.total}>Total : {total.toFixed(2)} €</Text>
          <Button title="Commander" onPress={handleOrder} />
          <View style={{ height: 12 }} />
          <Button
            title="Vider le panier"
            color="#a00"
            onPress={() => {
              Alert.alert(
                'Vider le panier',
                'Voulez-vous vraiment supprimer tous les articles du panier ?',
                [
                  { text: 'Annuler', style: 'cancel' },
                  { text: 'Vider', style: 'destructive', onPress: () => clearCart() },
                ]
              );
            }}
          />
        </>
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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    marginBottom: 16,
    padding: 10,
    elevation: 1,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  price: {
    color: '#1D3D47',
    marginBottom: 4,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  qtyBtn: {
    backgroundColor: '#A1CEDC',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginHorizontal: 4,
  },
  qtyBtnText: {
    fontWeight: 'bold',
    color: '#1D3D47',
    fontSize: 16,
  },
  qty: {
    fontSize: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  removeBtn: {
    marginLeft: 8,
    backgroundColor: '#ffb3b3',
    borderRadius: 6,
    padding: 6,
  },
  removeBtnText: {
    color: '#a00',
    fontWeight: 'bold',
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
    marginVertical: 16,
  },
}); 