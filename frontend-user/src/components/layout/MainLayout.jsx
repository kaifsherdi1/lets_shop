import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { getStoredCurrency } from '../../utils/currency';

const MainLayout = ({ children }) => {
  const [currency, setCurrency] = useState(getStoredCurrency() || 'AED');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar currency={currency} setCurrency={setCurrency} />
      <main style={{ flex: 1 }}>
        {children ? (
          typeof children === 'function' ? children({ currency, setCurrency }) : children
        ) : (
          <Outlet context={{ currency, setCurrency }} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
