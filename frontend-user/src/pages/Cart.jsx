import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency, getStoredCurrency } from '../utils/currency';
import Header from '../components/layout/Header';
import { FiTrash2 } from 'react-icons/fi';
import './Cart.css';

const Cart = () => {
  const [currency, setCurrency] = useState(getStoredCurrency());
  const { cart, updateCartItem, removeFromCart, loading } = useCart();
  const navigate = useNavigate();

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!confirm('Remove this item from cart?')) return;

    try {
      await removeFromCart(itemId);
    } catch (error) {
      alert('Failed to remove item');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div>
        <Header currency={currency} setCurrency={setCurrency} />
        <div className="container">
          <div className="loading">Loading cart...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header currency={currency} setCurrency={setCurrency} />

      <div className="container">
        <h1 className="page-title">Shopping Cart</h1>

        {!cart || cart.items?.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button onClick={() => navigate('/products')} className="btn-primary">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cart.items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    {item.product.images?.[0] ? (
                      <img src={item.product.images[0]} alt={item.product.name} />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>

                  <div className="item-details">
                    <h3>{item.product.name}</h3>
                    <p className="item-price">
                      {formatCurrency(item.price, currency)}
                    </p>
                  </div>

                  <div className="item-quantity">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-subtotal">
                    {formatCurrency(item.subtotal, currency)}
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="btn-remove"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Total Items:</span>
                <span>{cart.total_items}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>{formatCurrency(cart.total, currency)}</span>
              </div>
              <button onClick={handleCheckout} className="btn-checkout">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
