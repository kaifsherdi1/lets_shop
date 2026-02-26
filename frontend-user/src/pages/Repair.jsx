import React, { useState } from 'react';
import PageBanner from '../components/layout/PageBanner';

const service1 = '/assets/images/service-1.jpg';
const service2 = '/assets/images/service-2.jpg';
const service3 = '/assets/img/service-3.jpg';
const service4 = '/assets/img/service-4.jpg';
const whyJoin = '/assets/img/why-join.jpg';

const SERVICES = [
  { id: 1, img: service1, title: 'Expert Repair Service', desc: 'Professional repair for all your devices and products. Fast turnaround and quality guaranteed.' },
  { id: 2, img: service2, title: 'Component Replacement', desc: 'Original parts replacement with manufacturer warranty. Only genuine components used.' },
  { id: 3, img: service3, title: 'Diagnostic Check', desc: 'Comprehensive diagnostic to identify issues. Free initial assessment.' },
  { id: 4, img: service4, title: 'Software Support', desc: 'Software updates, troubleshooting and optimization for all your devices.' },
  { id: 5, img: service1, title: 'On-Site Service', desc: 'Our technicians come to you. Convenient on-site repair and support available.' },
  { id: 6, img: service2, title: 'Warranty Service', desc: 'Full warranty support for all products purchased from LetsShop.' },
];

const ACCORDION = [
  {
    id: 1, title: 'Why Choose Our Repair Service?',
    body: 'Our certified technicians have years of experience repairing all major brands and products. We use only original parts and provide a warranty on all repairs, giving you peace of mind.',
  },
  {
    id: 2, title: 'How Long Does a Repair Take?',
    body: 'Most repairs are completed within 24-48 hours. Complex repairs may take up to 5 business days. We\'ll give you an accurate estimate before we start.',
  },
  {
    id: 3, title: 'Is There a Service Warranty?',
    body: 'Yes! All repairs come with a 90-day service warranty. If the same issue occurs within this period, we fix it for free.',
  },
];

export default function Repair() {
  const [openAccordion, setOpenAccordion] = useState(1);

  function toggle(id) {
    setOpenAccordion(prev => prev === id ? null : id);
  }

  return (
    <main>
      <PageBanner title="Repair Service" crumbs={[{ label: 'Services', to: '/services/repair' }, { label: 'Repair' }]} />

      {/* Services Grid */}
      <section className="ul-section-spacing overflow-hidden">
        <div className="ul-container">
          <div className="ul-section-heading justify-content-center text-center" style={{ marginBottom: '40px' }}>
            <div>
              <span className="ul-section-sub-title">Our Services</span>
              <h2 className="ul-section-title">Professional Repair Solutions</h2>
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
                    <h3 className="ul-service-title">
                      <button style={{ background: 'none', border: 'none', fontWeight: 'inherit', fontSize: 'inherit', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                        {service.title}
                      </button>
                    </h3>
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

      {/* Why Join Section */}
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
                  <h2 className="ul-section-title">Why Choose LetsShop Repair Service</h2>
                  <p className="ul-section-descr">
                    We combine expert knowledge with genuine parts to deliver repairs that last.
                    Our customer-first approach ensures you're always kept informed throughout the process.
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
