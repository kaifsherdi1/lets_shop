import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Products from './pages/Products.jsx';
import Categories from './pages/Categories.jsx';
import Orders from './pages/Orders.jsx';
import Commissions from './pages/Commissions.jsx';
import Withdrawals from './pages/Withdrawals.jsx';
import Users from './pages/Users.jsx';
import Portal from './pages/Portal.jsx';
import NotFound from './pages/NotFound.jsx';

import { can, homePath, isPortalRole } from './utils/permissions.js';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { token } = useAuth();
  return token ? <Navigate to="/" replace /> : children;
}

// Vendors land on their portal, admins/managers on the ops dashboard, and
// roles without a dashboard (accountant) on their first usable screen.
function HomeScreen() {
  const { user } = useAuth();
  if (isPortalRole(user?.role)) return <Portal />;
  if (can(user?.role, 'dashboard')) return <Dashboard />;
  return <Navigate to={homePath(user?.role)} replace />;
}

// Only render an area the signed-in role is allowed to use (see permissions.js).
function Allow({ area, children }) {
  const { user } = useAuth();
  return can(user?.role, area) ? children : <Navigate to={homePath(user?.role)} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<HomeScreen />} />
            <Route path="products" element={<Allow area="products"><Products /></Allow>} />
            <Route path="categories" element={<Allow area="categories"><Categories /></Allow>} />
            <Route path="orders" element={<Allow area="orders"><Orders /></Allow>} />
            <Route path="commissions" element={<Allow area="commissions"><Commissions /></Allow>} />
            <Route path="withdrawals" element={<Allow area="withdrawals"><Withdrawals /></Allow>} />
            <Route path="users" element={<Allow area="users"><Users /></Allow>} />
            {/* The portal home is "/" for vendors; keep old /portal links working. */}
            <Route path="portal" element={<Navigate to="/" replace />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
