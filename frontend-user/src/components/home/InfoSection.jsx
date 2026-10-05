import React, { useEffect, useState } from 'react';
import { productAPI } from '../../api/products';
import { Stagger, StaggerItem } from '../motion/Reveal';
import Tilt from '../motion/Tilt';
import CountUp from '../motion/CountUp';

export default function InfoSection() {
  const [productCount, setProductCount] = useState(null);

  useEffect(() => {
    productAPI
      .getProducts({ per_page: 8 }) // same params as Featured products, so the request is shared
      .then((d) => {
        const total = d?.total ?? d?.meta?.total ?? (Array.isArray(d?.data) ? d.data.length : null);
        if (total != null) setProductCount(total);
      })
      .catch(() => {});
  }, []);

  const stats = [
    { icon: 'flaticon-costumer', number: '5,000+', label: 'Orders Delivered' },
    {
      icon: 'flaticon-package',
      number: productCount != null ? `${productCount.toLocaleString()}+` : '—',
      label: 'Products Available',
    },
    { icon: 'flaticon-team', number: '24/7', label: 'Customer Support' },
    { icon: 'flaticon-pin', number: '2', label: 'Countries Served' },
  ];

  return (
    <div className="ul-stats ul-section-spacing" style={{ background: '#fff' }}>
      <div className="ul-container">
        <Stagger className="row row-cols-lg-4 row-cols-md-3 row-cols-2 row-cols-xxs-1 ul-bs-row justify-content-center gy-4" gap={0.12}>
          {stats.map((stat) => (
            <StaggerItem className="col" key={stat.label}>
              <Tilt max={12} radius={24}>
                <div className="ls-stat">
                  <span className="ls-stat-icon ls-depth">
                    <i className={stat.icon}></i>
                  </span>
                  <span className="ls-stat-number ls-depth">
                    <CountUp key={stat.number} value={stat.number} />
                  </span>
                  <span className="ls-stat-label">{stat.label}</span>
                </div>
              </Tilt>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </div>
  );
}
