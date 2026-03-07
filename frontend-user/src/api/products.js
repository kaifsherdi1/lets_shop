import axios from './axios';

export const productAPI = {
  // Get all products with filters — handles paginated { data:[...] } or flat
  getProducts: async (params = {}) => {
    const response = await axios.get('/products', { params });
    return response.data;
  },

  // Get single product — backend returns { product: {...} }
  getProduct: async (id) => {
    const response = await axios.get(`/products/${id}`);
    // Backend ProductController.show wraps in { product: {...} }
    return response.data?.product || response.data;
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
