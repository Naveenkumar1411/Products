import axios from 'axios';

const BASE_URL = 'https://fakestoreapi.com/products';

export const fetchProducts = async () => {
  try {
    const res = await axios.get(BASE_URL);
    return res;
  } catch (error) {
    throw error;
  }
};

export const fetchProductById = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const addProduct = async (data) => {
  try {
    const res = await axios.post(BASE_URL, data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (id, data) => {
  try {
    const res = await axios.put(`${BASE_URL}/${id}`, data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await axios.delete(`${BASE_URL}/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
};
