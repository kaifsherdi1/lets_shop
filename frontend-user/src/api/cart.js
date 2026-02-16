import axios from './axios';

export const cartAPI = {
  // Get cart
  getCart: async () => {
    const response = await axios.get('/cart');
    return response.data;
  },

  // Add item to cart
  addItem: async (productId, quantity) => {
    const response = await axios.post('/cart/items', {
      product_id: productId,
      quantity,
    });
    return response.data;
  },

  // Update cart item
  updateItem: async (itemId, quantity) => {
    const response = await axios.put(`/cart/items/${itemId}`, {
      quantity,
    });
    return response.data;
  },

  // Remove cart item
  removeItem: async (itemId) => {
    const response = await axios.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  // Clear cart
  clearCart: async () => {
    const response = await axios.delete('/cart/clear');
    return response.data;
  },
};
