import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/currency';
import ProductImage from './ProductImage';
import Tilt from '../motion/Tilt';
import './ProductCard.css';

/**
 * ProductCard — template donation-card layout with a 3D tilt, glare, zooming
 * image and an animated add-to-cart button.
 */
const ProductCard = ({ product, currency, onAddToCart, isAuthenticated }) => {
  const price = currency === 'INR' ? product.price_inr : product.price_aed;
  const inStock = product.stock_quantity > 0;
  // 'idle' | 'busy' (request in flight — blocks double clicks) | 'added'
  const [state, setState] = useState('idle');

  const handleAdd = async () => {
    if (!inStock || state !== 'idle') return;
    setState('busy');
    const ok = await onAddToCart(product.id);
    if (ok) {
      setState('added');
      setTimeout(() => setState('idle'), 1200);
    } else {
      setState('idle');
    }
  };

  return (
    <Tilt max={7} scale={1.025} radius={20}>
      <div className="ls-pcard">
        {/* ── Image area ── */}
        <Link to={`/products/${product.id}`} className="ls-pcard-media" tabIndex={-1} aria-hidden="true">
          <ProductImage product={product} className="ls-pcard-img" />
          <span className="ls-pcard-shade" />

          {product.category?.name && <span className="ls-pcard-tag ls-depth">{product.category.name}</span>}

          {inStock && <span className="ls-pcard-quick">Quick view →</span>}

          {!inStock && (
            <div className="ls-pcard-out">
              <span>Out of Stock</span>
            </div>
          )}
        </Link>

        {/* ── Content ── */}
        <div className="ls-pcard-body">
          <h3 className="ls-pcard-title">
            <Link to={`/products/${product.id}`}>{product.name}</Link>
          </h3>

          {product.description && <p className="ls-pcard-descr">{product.description}</p>}

          <div style={{ marginTop: 'auto' }}>
            <div className="ls-pcard-price-row">
              <span className="ls-pcard-price">{formatCurrency(price, currency)}</span>
              {inStock && <span className="ls-pcard-stock">✓ {product.stock_quantity} left</span>}
            </div>

            <div className="ls-pcard-divider" />

            <div className="ls-pcard-actions">
              <Link to={`/products/${product.id}`} className="ls-pcard-link">
                View Details
                <span className="ls-pcard-link-arrow">→</span>
              </Link>

              <motion.button
                type="button"
                onClick={handleAdd}
                disabled={!inStock || state === 'busy'}
                aria-busy={state === 'busy'}
                className={`ls-pcard-add${state === 'added' ? ' is-adding' : ''}`}
                whileTap={inStock ? { scale: 0.9 } : undefined}
                title={!isAuthenticated && inStock ? 'Sign in to add to cart' : undefined}
              >
                {!inStock ? 'Sold Out' : state === 'busy' ? 'Adding…' : state === 'added' ? '✓ Added' : 'Add to Cart'}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </Tilt>
  );
};

export default ProductCard;
