import React, { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { getStoredCurrency, setStoredCurrency } from '../../utils/currency';

const MainLayout = ({ children }) => {
  const [currency, setCurrencyState] = useState(() => getStoredCurrency() || 'AED');

  // Single source of truth for the active currency — persists the choice too.
  const setCurrency = useCallback((next) => {
    setCurrencyState(next);
    setStoredCurrency(next);
  }, []);

  const ctx = { currency, setCurrency };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar currency={currency} setCurrency={setCurrency} />
      <main style={{ flex: 1 }}>
        {children
          ? typeof children === 'function'
            ? children(ctx)
            : children
          : <Outlet context={ctx} />}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
