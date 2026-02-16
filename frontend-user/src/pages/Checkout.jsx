import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../api/orders';
import { formatCurrency, getStoredCurrency } from '../utils/currency';
import Header from '../components/layout/Header';
import './Checkout.css';

const Checkout = () => {
  const [currency, setCurrency] = useState(getStoredCurrency());
  const [orderCurrency, setOrderCurrency] = useState('INR');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
  });
  const [loading, setLoading] = useState(false);

  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!cart || cart.items?.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        address,
        currency: orderCurrency,
        payment_method: paymentMethod,
      };

      const response = await orderAPI.placeOrder(orderData);

      alert('Order placed successfully!');
      await refreshCart();
      navigate(`/orders`);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items?.length === 0) {
    return (
      <div>
        <Header currency={currency} setCurrency={setCurrency} />
        <div className="container">
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button onClick={() => navigate('/products')} className="btn-primary">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header currency={currency} setCurrency={setCurrency} />

      <div className="container">
        <h1 className="page-title">Checkout</h1>

        <div className="checkout-layout">
          <div className="checkout-form">
            <form onSubmit={handlePlaceOrder}>
              <section className="form-section">
                <h2>Delivery Address</h2>

                <div className="form-group">
                  <label>Address Line 1 *</label>
                  <input
                    type="text"
                    name="address_line1"
                    value={address.address_line1}
                    onChange={handleInputChange}
                    required
                    placeholder="Street address"
                  />
                </div>

                <div className="form-group">
                  <label>Address Line 2</label>
                  <input
                    type="text"
                    name="address_line2"
                    value={address.address_line2}
                    onChange={handleInputChange}
                    placeholder="Apartment, suite, etc. (optional)"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Country *</label>
                    <input
                      type="text"
                      name="country"
                      value={address.country}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={address.pincode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </section>

              <section className="form-section">
                <h2>Order Currency</h2>
                <div className="currency-options">
                  <label className="radio-option">
                    <input
                      type="radio"
                      value="INR"
                      checked={orderCurrency === 'INR'}
                      onChange={(e) => setOrderCurrency(e.target.value)}
                    />
                    <span>Indian Rupee (₹ INR)</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      value="AED"
                      checked={orderCurrency === 'AED'}
                      onChange={(e) => setOrderCurrency(e.target.value)}
                    />
                    <span>UAE Dirham (د.إ AED)</span>
                  </label>
                </div>
              </section>

              <section className="form-section">
                <h2>Payment Method</h2>
                <div className="payment-options">
                  <label className="radio-option">
                    <input
                      type="radio"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>Cash on Delivery</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>Online Payment</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      value="emi"
                      checked={paymentMethod === 'emi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>EMI</span>
                  </label>
                </div>
              </section>

              <button type="submit" className="btn-place-order" disabled={loading}>
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>

            <div className="summary-items">
              {cart.items.map((item) => (
                <div key={item.id} className="summary-item">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>{formatCurrency(item.subtotal, orderCurrency)}</span>
                </div>
              ))}
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>{formatCurrency(cart.total, orderCurrency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
