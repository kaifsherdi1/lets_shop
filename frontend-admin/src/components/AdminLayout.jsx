import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

const PAGE_TITLES = {
  '/':             { title: 'Dashboard',   sub: 'Welcome back, here\'s what\'s happening today' },
  '/products':     { title: 'Products',    sub: 'Manage your product catalog' },
  '/categories':   { title: 'Categories',  sub: 'Organize products into categories' },
  '/orders':       { title: 'Orders',      sub: 'View and manage all customer orders' },
  '/commissions':  { title: 'Commissions', sub: 'Review and approve agent commissions' },
  '/withdrawals':  { title: 'Withdrawals', sub: 'Manage wallet withdrawal requests' },
  '/users':        { title: 'Users',       sub: 'Manage all registered users' },
};

export default function AdminLayout() {
  const location = useLocation();
  const meta = PAGE_TITLES[location.pathname] || { title: 'Admin', sub: '' };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="header-breadcrumb">
            <div className="page-title">{meta.title}</div>
            <div className="page-sub">{meta.sub}</div>
          </div>
          <div className="header-right">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'var(--primary-bg)', borderRadius: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--primary-dark)', fontWeight: 600 }}>Live</span>
            </div>
          </div>
        </header>
        {/* Page Content */}
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
