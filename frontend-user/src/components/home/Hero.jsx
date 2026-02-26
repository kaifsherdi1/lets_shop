import React from 'react';
import { Link } from 'react-router-dom';

import bannerImg from '../../assets/img/banner-img.png';
import vectorImg from '../../assets/img/vector-img.png';
import bannerVector1 from '../../assets/img/banner-img-vector-1.png';
import bannerVector2 from '../../assets/img/banner-img-vector-2.png';
import user1 from '../../assets/img/user-1.png';
import user2 from '../../assets/img/user-2.png';
import user3 from '../../assets/img/user-3.png';

export default function Hero() {
  return (
    <section className="ul-banner">
      <div className="ul-banner-container">
        {/* ul-stack-reverse-mobile ensures content stacks: Text then Image on mobile */}
        <div className="row gy-5 row-cols-lg-2 row-cols-1 align-items-center flex-column-reverse flex-lg-row">
          {/* Banner Text */}
          <div className="col">
            <div className="ul-banner-txt" style={{ paddingRight: '0' }}>
              <div>
                <span className="ul-banner-sub-title ul-section-sub-title">Shop The Best Products</span>
                <h1 className="ul-banner-title">Quality Products For Every Need &amp; Budget</h1>
                <p className="ul-banner-descr" style={{ maxWidth: '600px' }}>
                  Discover thousands of products handpicked for quality and value.
                  Shop from our wide range of categories and get the best deals delivered to your door.
                </p>
                <div className="ul-banner-btns">
                  <Link to="/products" className="ul-btn">
                    <i className="flaticon-fast-forward-double-right-arrows-symbol"></i> Shop Now
                  </Link>

                  <div className="ul-banner-stat" style={{ marginTop: '10px' }}>
                    <div className="imgs">
                      <img src={user1} alt="Customer" />
                      <img src={user3} alt="Customer" />
                      <img src={user2} alt="Customer" />
                      <span className="number">5K+</span>
                    </div>
                    <span className="txt">Happy Customers</span>
                  </div>
                </div>
              </div>

              {/* Hide decorative vectors on small screens to prevent overflow and visual noise */}
              <img src={vectorImg} alt="" className="ul-banner-txt-vector d-none d-md-block" />
            </div>
          </div>

          {/* Banner Image */}
          <div className="col">
            <div className="ul-banner-img">
              <div className="img-wrapper">
                <img src={bannerImg} alt="Banner" style={{ width: '100%', height: 'auto', maxWidth: '550px', margin: '0 auto' }} />
              </div>
              <div className="ul-banner-img-vectors d-none d-sm-block">
                <img src={bannerVector1} alt="" className="vector-1" />
                <img src={bannerVector2} alt="" className="vector-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
