import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import { addProduct } from '../lib/Api';
import { Ionicons } from '@expo/vector-icons';

export default function AddProduct() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setImage(`data:image/jpeg;base64,${base64}`);
      setImageUri(uri);
      setImageUrl(''); // clear URL input
    }
  };

  const handleImageUrlChange = (url) => {
    setImageUrl(url);
    setImage(url);
    setImageUri('');
  };

  const removeImage = () => {
    setImage('');
    setImageUri('');
    setImageUrl('');
  };

  const handleAdd = async () => {
    if (!title || !price || !category || !image) {
      Alert.alert('All fields are required');
      return;
    }

    try {
      await addProduct({ title, price: parseFloat(price), category, image });
      Alert.alert('Product added!');
      router.replace('/');
    } catch (error) {
      Alert.alert('Failed to add product');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Product</Text>
      </View>

      <View style={styles.container}>
        <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
        <TextInput
          style={styles.input}
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
        />

        {/* Pick Image Option */}
        <TouchableOpacity
          style={[styles.imagePicker, imageUrl ? styles.disabled : null]}
          onPress={pickImage}
          disabled={!!imageUrl}
        >
          <Text style={{ color: imageUrl ? '#aaa' : '#555' }}>Pick Image from Gallery</Text>
        </TouchableOpacity>

        
        <TextInput
          style={styles.input}
          placeholder="Or enter Image URL"
          value={imageUrl}
          onChangeText={handleImageUrlChange}
          editable={!imageUri || image.startsWith('http')}
          placeholderTextColor={imageUri && !image.startsWith('http') ? '#ccc' : undefined}
        />

       
        {imageUri ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.preview} />
            <TouchableOpacity onPress={removeImage} style={styles.removeButton}>
              <Ionicons name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ) : null}

        <Button title="Add Product" onPress={handleAdd} />
      </View>
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
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  container: {
    padding: 20,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 15,
    padding: 8,
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  disabled: {
    backgroundColor: '#f0f0f0',
  },
  imagePreviewContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  preview: {
    width: 100,
    height: 100,
    borderRadius: 6,
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'white',
    borderRadius: 12,
  },
});
