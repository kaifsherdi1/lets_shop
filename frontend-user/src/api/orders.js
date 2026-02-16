import axios from './axios';

export const orderAPI = {
  // Get all orders
  getOrders: async () => {
    const response = await axios.get('/orders');
    return response.data;
  },

  // Get single order
  getOrder: async (id) => {
    const response = await axios.get(`/orders/${id}`);
    return response.data;
  },

  // Place order
  placeOrder: async (data) => {
    const response = await axios.post('/orders', data);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id) => {
    const response = await axios.post(`/orders/${id}/cancel`);
    return response.data;
  },
};
