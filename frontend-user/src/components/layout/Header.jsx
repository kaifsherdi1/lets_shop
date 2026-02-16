import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart, FiUser, FiLogOut, FiPackage } from 'react-icons/fi';
import { setStoredCurrency } from '../../utils/currency';
import './Header.css';

const Header = ({ currency, setCurrency }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    setStoredCurrency(newCurrency);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>LetsShop</h1>
        </Link>

        <nav className="nav-menu">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          {isAuthenticated && <Link to="/orders">Orders</Link>}
        </nav>

        <div className="header-actions">
          <div className="currency-selector">
            <button
              className={currency === 'INR' ? 'active' : ''}
              onClick={() => handleCurrencyChange('INR')}
            >
              ₹ INR
            </button>
            <button
              className={currency === 'AED' ? 'active' : ''}
              onClick={() => handleCurrencyChange('AED')}
            >
              د.إ AED
            </button>
          </div>

          {isAuthenticated ? (
            <>
              <Link to="/cart" className="cart-icon">
                <FiShoppingCart size={24} />
                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
              </Link>

              <div className="user-menu">
                <FiUser size={24} />
                <div className="dropdown">
                  <p className="user-name">{user?.full_name}</p>
                  <Link to="/orders">
                    <FiPackage /> My Orders
                  </Link>
                  <button onClick={handleLogout}>
                    <FiLogOut /> Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn-outline">Login</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
