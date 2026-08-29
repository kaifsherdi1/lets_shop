import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const PAGE_TITLES = {
  '/products':     { title: 'Products',      sub: 'Manage your product catalog' },
  '/categories':   { title: 'Categories',    sub: 'Organize products into categories' },
  '/orders':       { title: 'Orders',        sub: 'View and manage all customer orders' },
  '/commissions':  { title: 'Commissions',   sub: 'Review and approve distributor & agent commissions' },
  '/withdrawals':  { title: 'Withdrawals',   sub: 'Manage wallet withdrawal requests' },
  '/users':        { title: 'Users',         sub: 'Create, manage and assign roles to accounts' },
  '/portal':       { title: 'My Portal',     sub: 'Your personal earnings and performance dashboard' },
};

const ROLE_LABEL = {
  admin: 'Administrator', manager: 'Manager', accountant: 'Accountant',
  hr: 'HR', distributor: 'Distributor', agent: 'Agent',
};

export default function AdminLayout() {
  const location = useLocation();
  const { user } = useAuth();
  const isVendor = ['distributor', 'agent'].includes(user?.role);
  const home = isVendor
    ? { title: 'My Portal', sub: 'Your earnings and performance at a glance' }
    : { title: 'Dashboard', sub: 'Everything that needs your attention today' };
  const meta = location.pathname === '/' ? home : (PAGE_TITLES[location.pathname] || { title: 'Admin', sub: '' });

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 14px', background: 'var(--primary-bg)', borderRadius: '999px' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                {(user?.full_name || user?.name || 'A')[0].toUpperCase()}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--primary-dark)', fontWeight: 700 }}>
                {ROLE_LABEL[user?.role] || 'Admin'}
              </span>
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
