import React, { useState } from 'react';
import PageBanner from '../components/layout/PageBanner';

const service1 = '/assets/images/service-1.jpg';
const service2 = '/assets/images/service-2.jpg';
const service3 = '/assets/img/service-3.jpg';
const service4 = '/assets/img/service-4.jpg';
const whyJoin = '/assets/img/why-join.jpg';

const SERVICES = [
  { id: 1, img: service1, title: 'Screen Replacement', desc: 'Crystal-clear screen replacements using OEM parts. All screen types supported.' },
  { id: 2, img: service2, title: 'Battery Replacement', desc: 'Restore your device\'s battery life with genuine replacement batteries.' },
  { id: 3, img: service3, title: 'Camera Replacement', desc: 'Get sharp photos again with professional camera module replacement.' },
  { id: 4, img: service4, title: 'Casing Replacement', desc: 'Full body casing replacement to make your device look brand new.' },
  { id: 5, img: service1, title: 'Speaker Replacement', desc: 'Restore crystal clear audio with our speaker replacement service.' },
  { id: 6, img: service2, title: 'Charging Port Replacement', desc: 'Fix charging issues with genuine charging port replacement.' },
];

const ACCORDION = [
  {
    id: 1, title: 'Do You Use Original Parts?',
    body: 'Yes, we source all replacement parts directly from manufacturers or authorized distributors. Every part comes with its own warranty and quality certification.',
  },
  {
    id: 2, title: 'Will My Data Be Safe?',
    body: 'Absolutely. We follow strict data protection protocols. All replacement services are performed without accessing or modifying your personal data.',
  },
  {
    id: 3, title: 'What is the Replacement Warranty?',
    body: 'All replaced parts come with a 6-month warranty. If a replaced part fails within this period, we replace it again at no additional cost.',
  },
];

export default function Replacement() {
  const [openAccordion, setOpenAccordion] = useState(1);

  function toggle(id) {
    setOpenAccordion(prev => prev === id ? null : id);
  }

  return (
    <main>
      <PageBanner title="Replacement Service" crumbs={[{ label: 'Services', to: '/services/repair' }, { label: 'Replacement' }]} />

      {/* Services Grid */}
      <section className="ul-section-spacing overflow-hidden">
        <div className="ul-container">
          <div className="ul-section-heading justify-content-center text-center" style={{ marginBottom: '40px' }}>
            <div>
              <span className="ul-section-sub-title">Our Services</span>
              <h2 className="ul-section-title">Professional Replacement Solutions</h2>
            </div>
          </div>
          <div className="row row-cols-md-3 row-cols-2 row-cols-xxs-1 ul-bs-row">
            {SERVICES.map(service => (
              <div className="col" key={service.id}>
                <div className="ul-service ul-service--inner">
                  <div className="ul-service-img">
                    <img src={service.img} alt={service.title} />
                  </div>
                  <div className="ul-service-txt">
                    <h3 className="ul-service-title">{service.title}</h3>
                    <p className="ul-service-descr">{service.desc}</p>
                    <a href="#" className="ul-service-btn">
                      <i className="flaticon-up-right-arrow"></i> View Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="ul-why-join ul-section-spacing pt-0">
        <div className="ul-why-join-wrapper ul-section-spacing">
          <div className="ul-container">
            <div className="row row-cols-md-2 row-cols-1 gy-4 align-items-center">
              <div className="col">
                <div className="ul-why-join-img">
                  <img src={whyJoin} alt="Why choose us" />
                </div>
              </div>
              <div className="col">
                <div className="ul-why-join-txt">
                  <span className="ul-section-sub-title">Why Us</span>
                  <h2 className="ul-section-title">Why Choose Our Replacement Service</h2>
                  <p className="ul-section-descr">
                    We're committed to bringing your devices back to life with original components.
                    Our expert technicians ensure every replacement is done correctly the first time.
                  </p>
                  <div className="ul-accordion">
                    {ACCORDION.map(item => (
                      <div key={item.id} className={`ul-single-accordion-item${openAccordion === item.id ? ' open' : ''}`}>
                        <div className="ul-single-accordion-item__header" onClick={() => toggle(item.id)} style={{ cursor: 'pointer' }}>
                          <div className="left">
                            <h3 className="ul-single-accordion-item__title">{item.title}</h3>
                          </div>
                          <span className="icon">
                            <i className={`flaticon-${openAccordion === item.id ? 'back' : 'next'}`}></i>
                          </span>
                        </div>
                        {openAccordion === item.id && (
                          <div className="ul-single-accordion-item__body">
                            <p>{item.body}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
