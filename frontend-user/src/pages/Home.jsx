import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../api/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, getStoredCurrency } from '../utils/currency';
import Header from '../components/layout/Header';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState(getStoredCurrency());
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productAPI.getProducts({ per_page: 8 });
      setProducts(data.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      await addToCart(productId, 1);
      alert('Product added to cart!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  return (
    <div>
      <Header currency={currency} setCurrency={setCurrency} />

      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to LetsShop</h1>
          <p>Your one-stop destination for quality products</p>
          <Link to="/products" className="btn-hero">Browse Products</Link>
        </div>
      </div>

      <div className="container">
        <section className="featured-section">
          <h2>Featured Products</h2>

          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-price">
                      {formatCurrency(
                        currency === 'INR' ? product.price_inr : product.price_aed,
                        currency
                      )}
                    </p>
                    <div className="product-actions">
                      <Link to={`/products/${product.id}`} className="btn-secondary">
                        View Details
                      </Link>
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className="btn-primary"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="view-all">
            <Link to="/products" className="btn-outline">View All Products</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
