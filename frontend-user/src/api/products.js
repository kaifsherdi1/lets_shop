import axios from './axios';

// Several components ask for the same data on one page (the header, the home
// categories section and the products filter all need categories). Share one
// in-flight request and keep the result briefly instead of refetching.
const memo = new Map();
const cached = (key, ttlMs, load) => {
  const hit = memo.get(key);
  if (hit && Date.now() - hit.at < ttlMs) return hit.promise;
  const promise = load().catch((err) => {
    memo.delete(key); // never cache failures
    throw err;
  });
  memo.set(key, { at: Date.now(), promise });
  return promise;
};

export const productAPI = {
  // Get all products with filters — handles paginated { data:[...] } or flat
  getProducts: async (params = {}) => {
    const key = `products:${JSON.stringify(params)}`;
    return cached(key, 30 * 1000, async () => (await axios.get('/products', { params })).data);
  },

  // Get single product — backend returns { product: {...} }
  getProduct: async (id) => {
    const response = await axios.get(`/products/${id}`);
    return response.data?.product || response.data;
  },

  // Get all categories (rarely change — shared for 5 minutes)
  getCategories: async () => cached('categories', 5 * 60 * 1000, async () => (await axios.get('/categories')).data),

  // Get category details
  getCategory: async (id) => {
    const response = await axios.get(`/categories/${id}`);
    return response.data;
  },
};
