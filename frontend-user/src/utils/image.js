const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Resolves a product image URL.
 * If the path is relative (starts with /storage), it prepends the backend URL.
 */
export const resolveProductImage = (imagePath) => {
  if (!imagePath) return null;
  
  if (imagePath.startsWith('http')) return imagePath;
  
  // Ensure it starts with /
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${BACKEND_URL}${path}`;
};
