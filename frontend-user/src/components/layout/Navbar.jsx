import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getStoredCurrency, setStoredCurrency } from '../../utils/currency';

// Template images
import logoSvg from '../../assets/img/logo.svg';

const CATEGORIES = [
  { id: 1, name: 'Electronics', slug: 'electronics' },
  { id: 2, name: 'Clothing', slug: 'clothing' },
  { id: 3, name: 'Home & Kitchen', slug: 'home-kitchen' },
  { id: 4, name: 'Books', slug: 'books' },
  { id: 5, name: 'Sports', slug: 'sports' },
  { id: 6, name: 'Beauty', slug: 'beauty' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currency, setCurrency] = useState(getStoredCurrency() || 'AED');

  // Dropdown hover states
  const [productsOpen, setProductsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [sideProductsOpen, setSideProductsOpen] = useState(false);
  const [sideServicesOpen, setSideServicesOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [navigate]);

  function handleCurrency(cur) {
    setCurrency(cur);
    setStoredCurrency(cur);
  }

  function handleLogout() {
    logout();
    navigate('/login');
    setDropdownOpen(false);
  }

  // Close sidebar when clicking backdrop
  function handleBackdrop() {
    setSidebarOpen(false);
  }

  return (
    <>
      {/* Backdrop for sidebar */}
      {sidebarOpen && (
        <div
          onClick={handleBackdrop}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 8998,
          }}
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <div className={`ul-sidebar${sidebarOpen ? ' sidebar-active' : ''}`} style={{ zIndex: 8999, backgroundColor: 'var(--ul-black)', transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <div className="ul-sidebar-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '20px' }}>
          <div className="ul-sidebar-header-logo">
            <Link to="/" onClick={() => setSidebarOpen(false)}>
              <span style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--ul-primary)' }}>
                Lets<span style={{ color: '#fff' }}>Shop</span>
              </span>
            </Link>
          </div>
          <button className="ul-sidebar-closer" onClick={() => setSidebarOpen(false)} style={{ color: '#fff', fontSize: '1.2rem' }}>
            <i className="flaticon-close"></i>
          </button>
        </div>

        {/* Mobile Nav */}
        <div className="ul-sidebar-header-nav-wrapper d-block d-lg-none" style={{ padding: '20px 10px' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <NavLink to="/" onClick={() => setSidebarOpen(false)} style={mobileLink}>Home</NavLink>
            <NavLink to="/about" onClick={() => setSidebarOpen(false)} style={mobileLink}>About</NavLink>

            {/* Products dropdown */}
            <div style={{ padding: '0 5px' }}>
              <button
                onClick={() => setSideProductsOpen(v => !v)}
                style={{ ...mobileLink, width: '100%', textAlign: 'left', background: 'rgba(255,255,255,0.03)', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                Products <i className={`flaticon-next`} style={{ fontSize: '0.8rem', transform: sideProductsOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }}></i>
              </button>
              {sideProductsOpen && (
                <div style={{ paddingLeft: '15px', marginTop: '5px', display: 'flex', flexDirection: 'column', gap: '5px', borderLeft: '2px solid var(--ul-primary)' }}>
                  <NavLink to="/products" onClick={() => setSidebarOpen(false)} style={mobileSubLink}>All Products</NavLink>
                  {CATEGORIES.map(c => (
                    <NavLink key={c.id} to={`/categories/${c.slug}`} onClick={() => setSidebarOpen(false)} style={mobileSubLink}>{c.name}</NavLink>
                  ))}
                </div>
              )}
            </div>

            {/* Services dropdown */}
            <div style={{ padding: '0 5px' }}>
              <button
                onClick={() => setSideServicesOpen(v => !v)}
                style={{ ...mobileLink, width: '100%', textAlign: 'left', background: 'rgba(255,255,255,0.03)', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                Services <i className={`flaticon-next`} style={{ fontSize: '0.8rem', transform: sideServicesOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }}></i>
              </button>
              {sideServicesOpen && (
                <div style={{ paddingLeft: '15px', marginTop: '5px', display: 'flex', flexDirection: 'column', gap: '5px', borderLeft: '2px solid var(--ul-primary)' }}>
                  <NavLink to="/services/repair" onClick={() => setSidebarOpen(false)} style={mobileSubLink}>Repair</NavLink>
                  <NavLink to="/services/replacement" onClick={() => setSidebarOpen(false)} style={mobileSubLink}>Replacement</NavLink>
                </div>
              )}
            </div>

            <NavLink to="/contact" onClick={() => setSidebarOpen(false)} style={mobileLink}>Contact</NavLink>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '15px', paddingTop: '15px' }}>
                {user ? (
                <>
                    <NavLink to="/cart" onClick={() => setSidebarOpen(false)} style={mobileLink}>Cart ({totalItems})</NavLink>
                    <NavLink to="/orders" onClick={() => setSidebarOpen(false)} style={mobileLink}>My Orders</NavLink>
                    <button onClick={() => { handleLogout(); setSidebarOpen(false); }} style={{ ...mobileLink, background: 'rgba(231, 76, 60, 0.15)', color: '#ff6b6b', marginTop: '10px' }}>
                    Logout
                    </button>
                </>
                ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <NavLink to="/login" onClick={() => setSidebarOpen(false)} style={{ ...mobileLink, textAlign: 'center', background: 'rgba(255,255,255,0.05)' }}>Login</NavLink>
                    <NavLink to="/register" onClick={() => setSidebarOpen(false)} style={{ ...mobileLink, textAlign: 'center', background: 'var(--ul-primary)' }}>Join Now</NavLink>
                </div>
                )}
            </div>
          </nav>
        </div>

        <div className="ul-sidebar-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '20px' }}>
          <span className="ul-sidebar-footer-title" style={{ color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.7rem' }}>Follow us</span>
          <div className="ul-sidebar-footer-social" style={{ marginTop: '15px' }}>
            <a href="#"><i className="flaticon-facebook"></i></a>
            <a href="#"><i className="flaticon-twitter"></i></a>
            <a href="#"><i className="flaticon-instagram"></i></a>
            <a href="#"><i className="flaticon-youtube"></i></a>
          </div>
        </div>
      </div>

      {/* ===== MAIN HEADER ===== */}
      <header className="ul-header">
        <div className="ul-header-bottom to-be-sticky">
          <div className="ul-header-bottom-wrapper ul-header-container">

            {/* Logo */}
            <div className="logo-container">
              <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: '#fff',
                  border: '1.5px solid rgba(0,0,0,0.08)',
                  borderRadius: '999px',
                  padding: '6px 18px 6px 8px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
                }}>
                  <span style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'var(--ul-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem',
                  }}>🛍️</span>
                  <span style={{
                    fontFamily: 'var(--font-quicksand)', fontWeight: 800,
                    fontSize: '1.1rem', color: 'var(--ul-black)',
                    letterSpacing: '-0.03em',
                  }}>
                    Lets<span style={{ color: 'var(--ul-primary)' }}>Shop</span>
                  </span>
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="ul-header-nav-wrapper">
              <div className="to-go-to-sidebar-in-mobile">
                <nav className="ul-header-nav">

                  {/* Home */}
                  <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>

                  {/* About */}
                  <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>

                  {/* Products dropdown */}
                  <div
                    className="has-sub-menu"
                    onMouseEnter={() => setProductsOpen(true)}
                    onMouseLeave={() => setProductsOpen(false)}
                  >
                    <a role="button" style={{ cursor: 'pointer' }}>Products</a>
                    <div className="ul-header-submenu" style={{ display: productsOpen ? 'block' : '' }}>
                      <ul>
                        <li><Link to="/products">All Products</Link></li>
                        {CATEGORIES.map(c => (
                          <li key={c.id}><Link to={`/categories/${c.slug}`}>{c.name}</Link></li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Services dropdown */}
                  <div
                    className="has-sub-menu"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <a role="button" style={{ cursor: 'pointer' }}>Services</a>
                    <div className="ul-header-submenu" style={{ display: servicesOpen ? 'block' : '' }}>
                      <ul>
                        <li><Link to="/services/repair">Repair</Link></li>
                        <li><Link to="/services/replacement">Replacement</Link></li>
                      </ul>
                    </div>
                  </div>

                  {/* Contact */}
                  <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink>
                </nav>
              </div>
            </div>

            {/* Header Actions */}
            <div className="ul-header-actions">
              {/* Currency Selector */}
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '6px', marginRight: '8px' }}>
                <button
                  onClick={() => handleCurrency('AED')}
                  style={{
                    background: currency === 'AED' ? 'var(--ul-primary)' : 'transparent',
                    color: currency === 'AED' ? '#fff' : 'inherit',
                    border: '1px solid',
                    borderColor: currency === 'AED' ? 'var(--ul-primary)' : 'rgba(0,0,0,0.15)',
                    borderRadius: '4px', padding: '3px 8px', fontSize: '0.78rem',
                    fontWeight: 700, cursor: 'pointer',
                  }}
                >AED</button>
                <button
                  onClick={() => handleCurrency('INR')}
                  style={{
                    background: currency === 'INR' ? 'var(--ul-primary)' : 'transparent',
                    color: currency === 'INR' ? '#fff' : 'inherit',
                    border: '1px solid',
                    borderColor: currency === 'INR' ? 'var(--ul-primary)' : 'rgba(0,0,0,0.15)',
                    borderRadius: '4px', padding: '3px 8px', fontSize: '0.78rem',
                    fontWeight: 700, cursor: 'pointer',
                  }}
                >INR</button>
              </div>

              {/* Cart Icon */}
              {user && (
                <Link to="/cart" style={{ position: 'relative', marginRight: '12px', fontSize: '1.3rem', color: 'var(--ul-black)' }}>
                  <i className="flaticon-shopping-cart"></i>
                  {totalItems > 0 && (
                    <span style={{
                      position: 'absolute', top: '-8px', right: '-10px',
                      background: 'var(--ul-primary)', color: '#fff',
                      borderRadius: '50%', width: '18px', height: '18px',
                      fontSize: '0.65rem', fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{totalItems}</span>
                  )}
                </Link>
              )}

              {/* Auth buttons / User dropdown */}
              {user ? (
                <div ref={dropdownRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setDropdownOpen(v => !v)}
                    style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      background: 'var(--ul-primary)', color: '#fff',
                      border: 'none', fontWeight: 800, fontSize: '1rem',
                      cursor: 'pointer',
                    }}
                  >
                    {user?.full_name?.[0]?.toUpperCase() || 'U'}
                  </button>
                  {dropdownOpen && (
                    <div style={{
                      position: 'absolute', right: 0, top: '50px',
                      background: '#fff', borderRadius: '10px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      minWidth: '160px', zIndex: 999,
                      padding: '8px 0',
                    }}>
                      <div style={{ padding: '10px 16px', borderBottom: '1px solid #f0f0f0', fontSize: '0.85rem', fontWeight: 700, color: 'var(--ul-black)' }}>
                        {user?.full_name || user?.email}
                      </div>
                      <Link to="/orders" onClick={() => setDropdownOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: '0.9rem', color: 'var(--ul-black)', fontWeight: 600 }}>
                        <i className="flaticon-list" style={{ marginRight: '8px', color: 'var(--ul-primary)' }}></i>My Orders
                      </Link>
                      <Link to="/cart" onClick={() => setDropdownOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: '0.9rem', color: 'var(--ul-black)', fontWeight: 600 }}>
                        <i className="flaticon-shopping-cart" style={{ marginRight: '8px', color: 'var(--ul-primary)' }}></i>My Cart
                      </Link>
                      <button onClick={handleLogout} style={{
                        display: 'block', width: '100%', padding: '10px 16px',
                        background: 'none', border: 'none', textAlign: 'left',
                        fontSize: '0.9rem', color: '#e74c3c', fontWeight: 600, cursor: 'pointer',
                      }}>
                        <i className="flaticon-logout" style={{ marginRight: '8px' }}></i>Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="d-sm-flex d-none" style={{ gap: '12px', alignItems: 'center' }}>
                  <Link to="/login" style={{ fontWeight: 700, color: 'var(--ul-black)', fontSize: '0.9rem' }}>
                    Login
                  </Link>
                  <Link to="/register" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    background: 'var(--ul-primary)', color: '#fff',
                    fontWeight: 700, fontSize: '0.88rem',
                    padding: '8px 20px', borderRadius: '999px',
                    boxShadow: '0 4px 14px rgba(235,83,16,0.3)',
                  }}>
                    <i className="flaticon-fast-forward-double-right-arrows-symbol"></i>
                    Join Now
                  </Link>
                </div>
              )}

              {/* Hamburger */}
              <button
                className="ul-header-sidebar-opener d-lg-none d-inline-flex"
                onClick={() => setSidebarOpen(true)}
                style={{ marginLeft: '12px' }}
              >
                <i className="flaticon-menu"></i>
              </button>
            </div>

          </div>
        </div>
      </header>
    </>
  );
}

// Mobile nav link styles
const mobileLink = {
  display: 'block', padding: '10px 12px', fontWeight: 700,
  color: '#fff', fontSize: '0.95rem', borderRadius: '6px',
  background: 'transparent',
};
const mobileSubLink = {
  display: 'block', padding: '8px 12px', fontWeight: 600,
  color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', borderRadius: '4px',
};
