import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { productAPI } from '../../api/products';
import { resolveProductImage } from '../../utils/image';
import BrandMark from './BrandMark';
import Icon from '../ui/Icon';
import './Navbar.css';

const FALLBACK_CATEGORIES = [
  { id: 1, name: 'Electronics', slug: 'electronics' },
  { id: 2, name: 'Fashion', slug: 'fashion' },
  { id: 3, name: 'Home & Kitchen', slug: 'home-kitchen' },
  { id: 4, name: 'Beauty & Personal Care', slug: 'beauty-personal-care' },
  { id: 5, name: 'Sports & Outdoors', slug: 'sports-outdoors' },
];

const ANNOUNCEMENTS = [
  'Free delivery on every order across the UAE & India',
  '14-day hassle-free returns on all purchases',
  'Secure, fully encrypted checkout',
];

const EASE = [0.16, 1, 0.3, 1];

const categoryLink = (c) => `/products?category=${c.id}`;

export default function Navbar({ currency, setCurrency }) {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const { pathname, search: locationSearch } = useLocation();

  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [announcement, setAnnouncement] = useState(0);
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menu, setMenu] = useState(null); // 'categories' | 'services' | 'account' | null

  const headerRef = useRef(null);

  useEffect(() => {
    let alive = true;
    productAPI
      .getCategories()
      .then((d) => {
        const cats = d?.categories || d?.data || (Array.isArray(d) ? d : []);
        if (alive && Array.isArray(cats) && cats.length) setCategories(cats);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setAnnouncement((i) => (i + 1) % ANNOUNCEMENTS.length), 4500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 38);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close every overlay on navigation; keep the search box in sync with ?q=.
  useEffect(() => {
    setDrawerOpen(false);
    setMenu(null);
    const q = new URLSearchParams(locationSearch).get('q');
    setQuery(pathname === '/products' && q ? q : '');
  }, [pathname, locationSearch]);

  useEffect(() => {
    const onDown = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) setMenu(null);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenu(null);
        setDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const toggle = (name) => setMenu((m) => (m === name ? null : name));

  // Hover opens desktop menus; a click that lands right after that hover must
  // not immediately close the menu again (touch devices emulate both events).
  const hoverAt = useRef(0);
  const hoverOpen = (name) => {
    hoverAt.current = Date.now();
    setMenu(name);
  };
  const clickToggle = (name) => {
    if (Date.now() - hoverAt.current < 400) setMenu(name);
    else toggle(name);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products');
  };

  const handleLogout = () => {
    logout();
    setMenu(null);
    setDrawerOpen(false);
    navigate('/login');
  };

  const firstName = (user?.full_name || user?.name || '').split(' ')[0];
  const navCategories = categories.slice(0, 5);

  return (
    <>
      <header ref={headerRef} className={`lsh${scrolled ? ' is-scrolled' : ''}`}>
        {/* ── Utility bar ── */}
        <div className="lsh-topbar">
          <div className="lsh-container lsh-topbar-inner">
            <div className="lsh-announce" aria-live="polite">
              <Icon name="truck" size={16} />
              <AnimatePresence mode="wait">
                <motion.span
                  key={announcement}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  {ANNOUNCEMENTS[announcement]}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="lsh-topbar-links">
              <Link to="/orders">Track order</Link>
              <Link to="/services/repair">Repair service</Link>
              <Link to="/contact">Help centre</Link>
              <div className="lsh-currency" role="group" aria-label="Currency">
                <Icon name="globe" size={15} />
                {['AED', 'INR'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={currency === c ? 'active' : ''}
                    aria-pressed={currency === c}
                    onClick={() => setCurrency(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Main bar ── */}
        <div className="lsh-main">
          <div className="lsh-container lsh-main-inner">
            <button type="button" className="lsh-icon-btn lsh-burger" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
              <Icon name="menu" />
            </button>

            <Link to="/" className="lsh-logo" aria-label="LetsShop home">
              <BrandMark size={34} />
              <span>
                Lets<b>Shop</b>
              </span>
            </Link>

            <form className="lsh-search" onSubmit={handleSearch} role="search">
              <Icon name="search" size={19} className="lsh-search-icon" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, brands and more"
                aria-label="Search products"
              />
              <button type="submit">Search</button>
            </form>

            <div className="lsh-actions">
              <div className="lsh-dd-wrap">
                <button
                  type="button"
                  className="lsh-action"
                  onClick={() => (user ? toggle('account') : navigate('/login'))}
                  aria-haspopup={user ? 'menu' : undefined}
                  aria-expanded={menu === 'account'}
                >
                  <Icon name="user" />
                  <span className="lsh-action-label">
                    <small>{user ? `Hello, ${firstName || 'there'}` : 'Hello, sign in'}</small>
                    <b>
                      Account <Icon name="chevronDown" size={14} />
                    </b>
                  </span>
                </button>
                <AnimatePresence>
                  {menu === 'account' && user && (
                    <motion.div
                      className="lsh-dropdown lsh-dropdown--right"
                      role="menu"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2, ease: EASE }}
                    >
                      <div className="lsh-dd-head">
                        <span className="lsh-avatar">{(firstName || user.email || 'U')[0].toUpperCase()}</span>
                        <div>
                          <b>{user.full_name || 'My account'}</b>
                          <small>{user.email}</small>
                        </div>
                      </div>
                      <Link to="/profile" role="menuitem"><Icon name="user" size={18} /> My profile</Link>
                      <Link to="/orders" role="menuitem"><Icon name="package" size={18} /> My orders</Link>
                      <Link to="/cart" role="menuitem"><Icon name="bag" size={18} /> My cart</Link>
                      <button type="button" role="menuitem" className="danger" onClick={handleLogout}>
                        <Icon name="logout" size={18} /> Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/orders" className="lsh-action lsh-hide-md">
                <Icon name="package" />
                <span className="lsh-action-label">
                  <small>Returns</small>
                  <b>&amp; Orders</b>
                </span>
              </Link>

              <Link to="/cart" className="lsh-action lsh-cart" aria-label={`Cart, ${totalItems} items`}>
                <span className="lsh-cart-icon">
                  <Icon name="bag" size={24} />
                  {totalItems > 0 && (
                    <span key={totalItems} className="lsh-badge">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </span>
                <span className="lsh-action-label">
                  <small>Your</small>
                  <b>Cart</b>
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Category bar ── */}
        <nav className="lsh-nav" aria-label="Primary">
          <div className="lsh-container lsh-nav-inner">
            <div className="lsh-dd-wrap" onMouseLeave={() => menu === 'categories' && setMenu(null)}>
              <button
                type="button"
                className={`lsh-all${menu === 'categories' ? ' open' : ''}`}
                onClick={() => clickToggle('categories')}
                onMouseEnter={() => hoverOpen('categories')}
                aria-expanded={menu === 'categories'}
              >
                <Icon name="grid" size={18} /> All categories <Icon name="chevronDown" size={15} />
              </button>
              <AnimatePresence>
                {menu === 'categories' && (
                  <motion.div
                    className="lsh-mega"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.22, ease: EASE }}
                  >
                    <div className="lsh-mega-list">
                      <span className="lsh-mega-title">Shop by department</span>
                      {categories.map((c) => (
                        <Link key={c.id} to={categoryLink(c)} className="lsh-mega-item">
                          <span className="thumb">
                            {c.image ? <img src={resolveProductImage(c.image)} alt="" loading="lazy" /> : <Icon name="grid" size={18} />}
                          </span>
                          <span className="txt">
                            <b>{c.name}</b>
                            {c.description && <small>{c.description}</small>}
                          </span>
                          <Icon name="chevronRight" size={16} className="chev" />
                        </Link>
                      ))}
                    </div>
                    <Link to="/products" className="lsh-mega-promo">
                      <span className="eyebrow">Just landed</span>
                      <b>Explore the full catalogue</b>
                      <small>Every category, one place — delivered across the UAE &amp; India.</small>
                      <span className="cta">
                        Shop all products <Icon name="arrowRight" size={16} />
                      </span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="lsh-links">
              <NavLink to="/" end>Home</NavLink>
              <NavLink to="/products" end>Shop all</NavLink>
              {navCategories.map((c) => (
                <Link key={c.id} to={categoryLink(c)} className={locationSearch === `?category=${c.id}` ? 'active' : ''}>
                  {c.name.replace(' & Personal Care', '').replace(' & Outdoors', '')}
                </Link>
              ))}
              <div className="lsh-dd-wrap" onMouseLeave={() => menu === 'services' && setMenu(null)}>
                <button
                  type="button"
                  className={`lsh-link-btn${pathname.startsWith('/services') ? ' active' : ''}`}
                  onClick={() => clickToggle('services')}
                  onMouseEnter={() => hoverOpen('services')}
                  aria-expanded={menu === 'services'}
                >
                  Services <Icon name="chevronDown" size={14} />
                </button>
                <AnimatePresence>
                  {menu === 'services' && (
                    <motion.div
                      className="lsh-dropdown"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2, ease: EASE }}
                    >
                      <Link to="/services/repair"><Icon name="wrench" size={18} /> Repair service</Link>
                      <Link to="/services/replacement"><Icon name="returns" size={18} /> Replacement service</Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </div>

            <a href="tel:+971501234567" className="lsh-helpline">
              <Icon name="phone" size={16} /> +971 50 123 4567
            </a>
          </div>
        </nav>
      </header>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="lsh-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              className="lsh-drawer"
             
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <div className="lsh-drawer-head">
                <span className="lsh-drawer-hello">
                  <span className="lsh-avatar"><Icon name="user" size={18} /></span>
                  {user ? `Hello, ${firstName || 'there'}` : <Link to="/login">Hello, sign in</Link>}
                </span>
                <button type="button" className="lsh-icon-btn" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
                  <Icon name="close" />
                </button>
              </div>

              <div className="lsh-drawer-body">
                <span className="lsh-drawer-title">Shop by department</span>
                {categories.map((c) => (
                  <Link key={c.id} to={categoryLink(c)} className="lsh-drawer-link">
                    {c.name} <Icon name="chevronRight" size={16} />
                  </Link>
                ))}
                <Link to="/products" className="lsh-drawer-link strong">
                  Shop all products <Icon name="chevronRight" size={16} />
                </Link>

                <span className="lsh-drawer-title">Help &amp; settings</span>
                <Link to="/" className="lsh-drawer-link">Home</Link>
                <Link to="/services/repair" className="lsh-drawer-link">Repair service</Link>
                <Link to="/services/replacement" className="lsh-drawer-link">Replacement service</Link>
                <Link to="/about" className="lsh-drawer-link">About us</Link>
                <Link to="/contact" className="lsh-drawer-link">Contact &amp; help</Link>
                {user && (
                  <>
                    <Link to="/orders" className="lsh-drawer-link">My orders</Link>
                    <Link to="/profile" className="lsh-drawer-link">My profile</Link>
                  </>
                )}

                <div className="lsh-drawer-currency">
                  <span>Currency</span>
                  <div className="lsh-currency lsh-currency--light">
                    {['AED', 'INR'].map((c) => (
                      <button key={c} type="button" className={currency === c ? 'active' : ''} onClick={() => setCurrency(c)}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lsh-drawer-foot">
                {user ? (
                  <button type="button" className="lsh-btn lsh-btn--ghost" onClick={handleLogout}>Sign out</button>
                ) : (
                  <>
                    <Link to="/login" className="lsh-btn lsh-btn--ghost">Sign in</Link>
                    <Link to="/register" className="lsh-btn">Create account</Link>
                  </>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
