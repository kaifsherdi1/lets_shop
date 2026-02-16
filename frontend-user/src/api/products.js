import axios from './axios';

export const productAPI = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    const response = await axios.get('/products', { params });
    return response.data;
  },

  // Get single product
  getProduct: async (id) => {
    const response = await axios.get(`/products/${id}`);
    return response.data;
  },

  // Get all categories
  getCategories: async () => {
    const response = await axios.get('/categories');
    return response.data;
  },

  // Get category details
  getCategory: async (id) => {
    const response = await axios.get(`/categories/${id}`);
    return response.data;
  },
};
