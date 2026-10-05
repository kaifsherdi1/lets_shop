import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Home ships in the main bundle (it is the landing page); every other page is
// split into its own chunk and fetched on first visit.
import Home from './pages/Home';
import MainLayout from './components/layout/MainLayout';
import { MotionConfig } from 'framer-motion';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const OtpVerification = lazy(() => import('./pages/OtpVerification'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const Profile = lazy(() => import('./pages/Profile'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const Repair = lazy(() => import('./pages/Repair'));
const Replacement = lazy(() => import('./pages/Replacement'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const NotFound = lazy(() => import('./pages/NotFound'));

import { Toaster } from 'react-hot-toast';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
      <ErrorBoundary>
        <AuthProvider>
          <CartProvider>
            <ScrollToTop />
            <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
            <Suspense fallback={<div className="ls-route-loading" aria-busy="true" />}>
            <Routes>
              {/* Auth routes (no MainLayout) */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<OtpVerification />} />

              {/* Pages with MainLayout */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/categories/:slug" element={<CategoryPage />} />
                <Route path="/services/repair" element={<Repair />} />
                <Route path="/services/replacement" element={<Replacement />} />
                <Route path="/repair" element={<Repair />} />
                <Route path="/replacement" element={<Replacement />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />

                {/* Protected routes */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* 404 inside the layout so it keeps the header/footer */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            </Suspense>
          </CartProvider>
        </AuthProvider>
      </ErrorBoundary>
      </MotionConfig>
    </BrowserRouter>
  );
}

export default App;
