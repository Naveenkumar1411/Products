import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, ActivityIndicator, Pressable,
  StyleSheet, Button, Image, Alert, TouchableOpacity, TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { fetchProducts, deleteProduct } from '../lib/Api';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const loadProducts = () => {
    setLoading(true);
    fetchProducts()
      .then(res => {
        setProducts(res.data);
        setFiltered(res.data);
      })
      .catch(() => {
        Alert.alert('Failed to load products');
        console.log('Error fetching products');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      products.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    );
  }, [search, products]);

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      Alert.alert('Product deleted');
      loadProducts();
    } catch (error) {
      Alert.alert('Failed to delete product');
      console.log('Error deleting product:', error);
    }
  };

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Product List</Text>
      </View>
      <TextInput
        style={styles.searchBox}
        placeholder="Search by title or category"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push(`/${item.id}`)}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>${item.price}</Text>
            <Text style={styles.category}>{item.category}</Text>
            <View style={styles.actions}>
              <Button title="View" onPress={() => router.push({ pathname: '/view', params: { id: item.id } })} />
              <Button title="Edit" onPress={() => router.push({ pathname: '/edit', params: { id: item.id } })} />
              <Button title="Delete" color="red" onPress={() => handleDelete(item.id)} />
            </View>
          </Pressable>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/add')}
      >
        <MaterialIcons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9370db',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  searchBox: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
  },
  container: { padding: 10 },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: { width: '100%', height: 150, resizeMode: 'contain', marginBottom: 10 },
  title: { fontWeight: 'bold', fontSize: 16 },
  price: { color: '#4CAF50', marginVertical: 5 },
  category: { color: '#888' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#9370db',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
});
