import { useDishes } from '@/hooks/useDishes';
import { useOrders } from '@/hooks/useOrders';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AdminScreen() {
  const { dishes, addDish, editDish, deleteDish, loading } = useDishes();
  const { orders } = useOrders();
  const [form, setForm] = useState({ name: '', description: '', price: '', image: '' });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');

  // Statistiques
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  // Calcul du plat le plus commandé
  const dishCount: Record<string, number> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      dishCount[item.name] = (dishCount[item.name] || 0) + item.quantity;
    });
  });
  let mostOrdered = '';
  let mostOrderedCount = 0;
  Object.entries(dishCount).forEach(([name, count]) => {
    if (count > mostOrderedCount) {
      mostOrdered = name;
      mostOrderedCount = count;
    }
  });

  // Fonction d'export CSV
  const handleExportCSV = () => {
    if (orders.length === 0) {
      Alert.alert('Export', 'Aucune commande à exporter.');
      return;
    }
    const header = 'Date,Total,Articles\n';
    const rows = orders.map(order => {
      const items = order.items.map(i => `${i.name} (x${i.quantity})`).join(' | ');
      return `${new Date(order.date).toLocaleString()},${order.total.toFixed(2)},"${items}"`;
    });
    const csv = header + rows.join('\n');
    Clipboard.setStringAsync(csv);
    Alert.alert('Export CSV', 'Le CSV a été copié dans le presse-papier.\n\n' + csv);
  };

  const handleAddOrEdit = async () => {
    if (!form.name || !form.description || !form.price) {
      setFeedback('Veuillez remplir tous les champs.');
      return;
    }
    const price = parseFloat(form.price);
    if (isNaN(price)) {
      setFeedback('Le prix doit être un nombre.');
      return;
    }
    const image = form.image ? { uri: form.image } : require('@/assets/images/burger.jpg');
    if (editingIndex !== null) {
      // Modification
      await editDish(editingIndex, { name: form.name, description: form.description, price, image });
      setFeedback('Plat modifié !');
    } else {
      // Ajout
      await addDish({ name: form.name, description: form.description, price, image });
      setFeedback('Plat ajouté !');
    }
    setForm({ name: '', description: '', price: '', image: '' });
    setEditingIndex(null);
  };

  const handleEdit = (idx: number) => {
    const dish = dishes[idx];
    setForm({ name: dish.name, description: dish.description, price: dish.price.toString(), image: '' });
    setEditingIndex(idx);
  };

  const handleDelete = (idx: number) => {
    Alert.alert('Supprimer', 'Voulez-vous vraiment supprimer ce plat ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => {
        await deleteDish(idx);
        setFeedback('Plat supprimé !');
      }},
    ]);
  };

  if (loading) {
    return <View style={styles.container}><ActivityIndicator size="large" /><Text>Chargement...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Espace Administration</Text>
      <Button title="Exporter les commandes (CSV)" onPress={handleExportCSV} />
      {/* Statistiques */}
      <View style={styles.statsBox}>
        <Text style={styles.statsText}>Nombre de commandes : {totalOrders}</Text>
        <Text style={styles.statsText}>Chiffre d'affaires : {totalRevenue.toFixed(2)} €</Text>
        <Text style={styles.statsText}>Plat le plus commandé : {mostOrdered ? `${mostOrdered} (${mostOrderedCount})` : 'Aucun'}</Text>
      </View>
      <Text style={styles.subtitle}>{editingIndex !== null ? 'Modifier un plat' : 'Ajouter un plat'}</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nom du plat"
          value={form.name}
          onChangeText={t => setForm(f => ({ ...f, name: t }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={form.description}
          onChangeText={t => setForm(f => ({ ...f, description: t }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Prix (€)"
          value={form.price}
          keyboardType="numeric"
          onChangeText={t => setForm(f => ({ ...f, price: t }))}
        />
        <TextInput
          style={styles.input}
          placeholder="URL de l'image (optionnel)"
          value={form.image}
          onChangeText={t => setForm(f => ({ ...f, image: t }))}
        />
        <Button title={editingIndex !== null ? 'Modifier' : 'Ajouter'} onPress={handleAddOrEdit} />
      </View>
      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
      <Text style={styles.subtitle}>Liste des plats</Text>
      <FlatList
        data={dishes}
        keyExtractor={(item, idx) => item.name + idx}
        renderItem={({ item, index }) => (
          <View style={styles.dishCard}>
            <Image source={item.image} style={styles.dishImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.dishName}>{item.name}</Text>
              <Text style={styles.dishDesc}>{item.description}</Text>
              <Text style={styles.dishPrice}>{item.price.toFixed(2)} €</Text>
            </View>
            <TouchableOpacity onPress={() => handleEdit(index)} style={styles.editBtn}>
              <Text style={styles.editBtnText}>Modifier</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(index)} style={styles.deleteBtn}>
              <Text style={styles.deleteBtnText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        )}
        style={{ marginTop: 16 }}
      />
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
    marginBottom: 12,
    alignSelf: 'center',
  },
  statsBox: {
    backgroundColor: '#eaf6fa',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  statsText: {
    fontSize: 16,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  form: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    fontSize: 16,
  },
  feedback: {
    color: '#1D3D47',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 8,
  },
  dishCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eaf6fa',
    borderRadius: 10,
    marginBottom: 12,
    padding: 10,
    elevation: 1,
  },
  dishImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  dishName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  dishDesc: {
    color: '#555',
    marginBottom: 4,
  },
  dishPrice: {
    color: '#1D3D47',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  editBtn: {
    backgroundColor: '#A1CEDC',
    borderRadius: 6,
    padding: 6,
    marginLeft: 8,
  },
  editBtnText: {
    color: '#1D3D47',
    fontWeight: 'bold',
  },
  deleteBtn: {
    backgroundColor: '#ffb3b3',
    borderRadius: 6,
    padding: 6,
    marginLeft: 8,
  },
  deleteBtnText: {
    color: '#a00',
    fontWeight: 'bold',
  },
}); 