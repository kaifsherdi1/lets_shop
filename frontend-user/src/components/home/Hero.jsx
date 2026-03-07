import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import bannerImg from '../../assets/images/banner-img.png';
import vectorImg from '../../assets/images/vector-img.png';
import bannerVector1 from '../../assets/images/banner-img-vector-1.png';
import bannerVector2 from '../../assets/images/banner-img-vector-2.png';
import user1 from '../../assets/images/user-1.png';
import user2 from '../../assets/images/user-2.png';
import user3 from '../../assets/images/user-3.png';

const slides = [
  {
    subTitle: "Shop The Best Products",
    title: "Quality Products For Every Need & Budget",
    descr: "Discover thousands of products handpicked for quality and value. Shop from our wide range of categories and get the best deals delivered to your door.",
    img: bannerImg
  },
  {
    subTitle: "New Season Arrivals",
    title: "Eco-Friendly Fashion & Sustainable Style",
    descr: "Explore our latest collection of sustainable apparel. Look good and feel good knowing your choices support a greener planet.",
    img: bannerImg // Reusing for consistency, can be changed later
  },
  {
    subTitle: "Tech & Innovation",
    title: "Cutting-Edge Gadgets At Your Fingertips",
    descr: "Upgrade your life with the newest smart home technology and high-performance electronics. Innovation meets affordability.",
    img: bannerImg
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 500);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 500);
  };

  // Auto-slide every 8 seconds
  useEffect(() => {
    const timer = setInterval(handleNext, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="ul-banner" style={{ 
      height: '100vh', 
      minHeight: '600px',
      background: 'var(--ul-black)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center' /* Centers content vertically in the 100vh area */
    }}>
      <style>{`
        .hero-wrapper {
          display: flex;
          height: 100%;
          width: 100%;
          flex-direction: row;
        }

        /* Hide template-inherited navigation buttons */
        .ul-banner-nav, 
        .ul-slider-nav, 
        .swiper-button-prev, 
        .swiper-button-next { 
          display: none !important; 
        }

        @media (max-width: 991px) {
          .hero-wrapper {
            flex-direction: column-reverse;
          }
          .hero-content-side {
            flex: 0 0 100% !important;
            padding: 40px 20px !important;
            text-align: center;
          }
          .hero-image-side {
            flex: 0 0 50% !important;
          }
          .image-mask-wrapper {
             clip-path: none !important;
          }
          .dot-indicator-wrapper {
            left: 50% !important;
            transform: translateX(-50%) !important;
          }
        }

        .hero-content-side {
          flex: 0 0 48%;
          display: flex;
          align-items: center;
          padding-left: 8%; 
          padding-right: 2%;
          z-index: 10;
        }

        .hero-image-side {
          flex: 0 0 52%;
          position: relative;
          height: 100%;
        }

        .image-mask-wrapper {
          position: absolute;
          inset: 0;
          overflow: hidden;
          clip-path: polygon(20.444% 6.836%, 20.444% 6.836%, 21.079% 1.445%, 21.969% -3.298%, 23.149% -7.442%, 24.655% -11.037%, 26.521% -14.129%, 28.783% -16.769%, 31.475% -19.005%, 34.633% -20.885%, 38.291% -22.458%, 42.485% -23.773%, 42.485% -23.773%, 51.821% -25.092%, 61.13% -24.265%, 70.354% -21.642%, 79.44% -17.571%, 88.329% -12.403%, 96.968% -6.486%, 105.299% -0.169%, 113.267% 6.199%, 120.817% 12.269%, 127.892% 17.691%, 127.892% 17.691%, 133.187% 21.665%, 138.424% 25.901%, 143.431% 30.413%, 148.036% 35.215%, 152.067% 40.322%, 155.351% 45.748%, 157.717% 51.507%, 158.992% 57.614%, 159.004% 64.083%, 157.581% 70.928%, 157.581% 70.928%, 154.251% 78.396%, 149.391% 84.901%, 143.283% 90.358%, 136.208% 94.679%, 128.447% 97.778%, 120.283% 99.568%, 111.997% 99.963%, 103.871% 98.874%, 96.186% 96.217%, 89.224% 91.904%, 89.224% 91.904%, 84.824% 88.551%, 80.861% 85.901%, 77.197% 83.943%, 73.692% 82.666%, 70.205% 82.06%, 66.599% 82.113%, 62.733% 82.815%, 58.469% 84.155%, 53.665% 86.122%, 48.184% 88.705%, 48.184% 88.705%, 41.958% 91.563%, 36.284% 93.719%, 31.115% 95.169%, 26.403% 95.908%, 22.102% 95.934%, 18.165% 95.243%, 14.544% 93.83%, 11.192% 91.692%, 8.062% 88.825%, 5.108% 85.226%, 5.108% 85.226%, 3.102% 82.034%, 1.619% 78.74%, 0.63% 75.368%, 0.106% 71.943%, 0.017% 68.487%, 0.333% 65.024%, 1.025% 61.58%, 2.062% 58.177%, 3.417% 54.84%, 5.058% 51.592%, 5.058% 51.592%, 8.7% 45.01%, 11.636% 39.594%, 13.954% 35.08%, 15.745% 31.209%, 17.099% 27.718%, 18.105% 24.347%, 18.852% 20.834%, 19.431% 16.919%, 19.932% 12.34%, 20.444% 6.836%);
          background: #1a1a1a;
          padding-left: 12px;
        }

        .image-mask-wrapper::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, #76b0ab 0%, rgba(118, 176, 171, 0.2) 50%, #76b0ab 100%);
          opacity: 0.9;
          z-index: -1;
        }

        .hero-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center left;
          transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .slide-fade-active {
          animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .nav-arrow {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 100;
        }

        .nav-arrow:hover {
          background: #76b0ab;
          border-color: #76b0ab;
        }

        .dot-indicator-wrapper {
          position: absolute; 
          bottom: 30px; 
          left: 8%;
          display: flex; 
          gap: 12px; 
          z-index: 100;
        }

        .dot-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dot-indicator.active {
          width: 30px;
          border-radius: 10px;
          background: #76b0ab;
        }
      `}</style>

      {/* Navigation Arrows */}
      <div className="nav-arrow" style={{ left: '20px' }} onClick={handlePrev}>
        <i className="flaticon-back"></i>
      </div>
      <div className="nav-arrow" style={{ right: '20px' }} onClick={handleNext}>
        <i className="flaticon-next"></i>
      </div>

      <div className="hero-wrapper">
        {/* Left Side: Content */}
        <div className="hero-content-side">
          <div className={isTransitioning ? 'opacity-0' : 'slide-fade-active'} style={{ 
            transition: 'opacity 0.4s ease', 
            width: '100%',
            maxWidth: '650px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginTop: currentSlide === 0 ? '3rem' : '0'
          }}>
            <span style={{ 
              color: '#76b0ab', 
              fontSize: '0.9rem', 
              fontWeight: '600', 
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '10px'
            }}>
              ♥ {slides[currentSlide].subTitle}
            </span>
            <h1 style={{ 
              fontSize: 'clamp(28px, 4.2vw, 58px)', 
              color: 'white', 
              lineHeight: '1.2',
              fontWeight: '800',
              marginBottom: '15px',
              letterSpacing: '-0.5px'
            }}>
              {slides[currentSlide].title}
            </h1>
            <p style={{ 
              color: 'rgba(255,255,255,0.7)', 
              fontSize: '0.95rem', 
              lineHeight: '1.6',
              maxWidth: '480px',
              marginBottom: '35px'
            }}>
              {slides[currentSlide].descr}
            </p>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '20px', 
              flexWrap: 'nowrap' 
            }}>
              <Link to="/products" className="ul-btn" style={{ 
                height: '52px', 
                padding: '0 32px', 
                fontSize: '0.9rem',
                borderRadius: '50px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#76b0ab',
                border: 'none'
              }}>
                <i className="flaticon-fast-forward-double-right-arrows-symbol"></i> Shop Now
              </Link>
              
              <div className="ul-banner-stat d-none d-sm-flex" style={{ flexShrink: 0 }}>
                <div className="imgs">
                  <img src={user1} alt="" style={{ border: '2px solid #000', width: '40px', height: '40px' }} />
                  <img src={user3} alt="" style={{ border: '2px solid #000', width: '40px', height: '40px' }} />
                  <img src={user2} alt="" style={{ border: '2px solid #000', width: '40px', height: '40px' }} />
                  <span className="number" style={{ width: '40px', height: '40px', background: 'var(--ul-primary)', color: '#000', fontSize: '0.8rem' }}>5K+</span>
                </div>
                <span className="txt" style={{ color: 'white', fontSize: '0.9rem', fontWeight: '500', marginLeft: '8px' }}>Happy Customers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="hero-image-side">
          <div className="image-mask-wrapper">
            <img 
              src={slides[currentSlide].img} 
              alt="" 
              className="hero-main-img" 
              style={{ 
                transform: isTransitioning ? 'scale(1.05)' : 'scale(1)',
                opacity: isTransitioning ? 0.7 : 1
              }} 
            />
            {/* Edge Shadow */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, #1a1a1a 0%, rgba(26, 26, 26, 0) 15%)',
              zIndex: 4
            }} />
          </div>

          {/* Floating Accents - Positioned better to avoid being cut */}
          <img src={bannerVector1} alt="" className="d-none d-xl-block" style={{
            position: 'absolute', top: '20%', right: '15%', zIndex: 6, width: '100px', opacity: 0.25
          }} />
          <img src={bannerVector2} alt="" className="d-none d-xl-block" style={{
            position: 'absolute', bottom: '20%', right: '20%', zIndex: 6, width: '100px', opacity: 0.25
          }} />
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="dot-indicator-wrapper">
        {slides.map((_, idx) => (
          <div 
            key={idx}
            className={`dot-indicator ${currentSlide === idx ? 'active' : ''}`}
            onClick={() => setCurrentSlide(idx)}
          />
        ))}
      </div>
    </section>
  );
}
