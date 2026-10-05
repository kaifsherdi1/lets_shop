import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

/**
 * Shared add-to-cart action for product grids. Resolves to true only when the
 * item really was added, so cards never show "Added" for a failed request.
 */
export default function useAddToCart() {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    async (productId, quantity = 1) => {
      if (!isAuthenticated) {
        toast('Please sign in to add items to your cart.', { icon: '🔒' });
        navigate('/login', { state: { from: `${location.pathname}${location.search}` } });
        return false;
      }
      try {
        await addToCart(productId, quantity);
        toast.success('Added to cart');
        return true;
      } catch (error) {
        // e.g. "Insufficient stock available" from the API
        toast.error(error.response?.data?.message || 'Could not add this item to your cart. Please try again.');
        return false;
      }
    },
    [isAuthenticated, addToCart, navigate, location.pathname, location.search]
  );
}
