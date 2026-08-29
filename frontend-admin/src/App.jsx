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

const STAFF_ROLES = ['admin', 'manager', 'accountant'];
const isPortalRole = (role) => ['distributor', 'agent'].includes(role);

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { token } = useAuth();
  return token ? <Navigate to="/" replace /> : children;
}

// Distributors/agents land on their portal; staff land on the ops dashboard.
function HomeScreen() {
  const { user } = useAuth();
  return isPortalRole(user?.role) ? <Portal /> : <Dashboard />;
}

// Gate a route to staff roles; portal users are bounced to their portal.
function StaffOnly({ children }) {
  const { user } = useAuth();
  return STAFF_ROLES.includes(user?.role) ? children : <Navigate to="/portal" replace />;
}

// The portal is only meaningful for vendors; staff are sent to the dashboard.
function PortalOnly({ children }) {
  const { user } = useAuth();
  return isPortalRole(user?.role) ? children : <Navigate to="/" replace />;
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
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<StaffOnly><Categories /></StaffOnly>} />
            <Route path="orders" element={<StaffOnly><Orders /></StaffOnly>} />
            <Route path="commissions" element={<Commissions />} />
            <Route path="withdrawals" element={<Withdrawals />} />
            <Route path="users" element={<StaffOnly><Users /></StaffOnly>} />
            <Route path="portal" element={<PortalOnly><Portal /></PortalOnly>} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
