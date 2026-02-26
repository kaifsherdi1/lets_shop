import React, { useState } from 'react';
import PageBanner from '../components/layout/PageBanner';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => { setSent(true); setForm({ name: '', email: '', subject: '', message: '' }); }, 500);
  }

  return (
    <main>
      <PageBanner title="Contact Us" crumbs={[{ label: 'Contact Us' }]} />

      {/* Contact Info Cards */}
      <div className="ul-contact-infos">
        <div className="ul-section-spacing ul-container">
          <div className="row row-cols-md-3 row-cols-2 row-cols-xxs-1 ul-bs-row">
            <div className="col">
              <div className="ul-contact-info">
                <div className="icon"><i className="flaticon-phone-call"></i></div>
                <div className="txt">
                  <span className="title">Phone Number</span>
                  <a href="tel:+971501234567">+971 50 123 4567</a>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="ul-contact-info">
                <div className="icon"><i className="flaticon-comment"></i></div>
                <div className="txt">
                  <span className="title">Email Address</span>
                  <a href="mailto:info@letsshop.com">info@letsshop.com</a>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="ul-contact-info">
                <div className="icon"><i className="flaticon-location"></i></div>
                <div className="txt">
                  <span className="title">Office Address</span>
                  <span className="descr">Dubai, United Arab Emirates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="ul-contact-map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.178527!2d55.270782!3d25.204849!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5e5b5b5b5b5b%3A0x5b5b5b5b5b5b5b5b!2sDubai!5e0!3m2!1sen!2sae"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="LetsShop Location"
        />
      </div>

      {/* Contact Form */}
      <section className="ul-inner-contact ul-section-spacing">
        <div className="ul-section-heading justify-content-center text-center">
          <div>
            <span className="ul-section-sub-title">Contact Us</span>
            <h2 className="ul-section-title">Feel Free To Write Us Anytime</h2>
          </div>
        </div>

        <div className="ul-inner-contact-container">
          {sent ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
              <h3 style={{ color: 'var(--ul-primary)', fontWeight: 800 }}>Message Sent!</h3>
              <p style={{ color: '#666' }}>We'll get back to you within 24 hours.</p>
              <button className="ul-btn" style={{ marginTop: '20px' }} onClick={() => setSent(false)}>
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="ul-contact-form ul-form">
              <div className="row row-cols-2 row-cols-xxs-1 ul-bs-row">
                <div className="col">
                  <div className="form-group">
                    <input
                      type="text" placeholder="Your Name" required
                      value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <input
                      type="email" placeholder="Email Address" required
                      value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <input
                      type="text" placeholder="Subject"
                      value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <textarea
                      placeholder="Type your message" rows={5} required
                      value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="col-12 text-center">
                  <button type="submit" className="ul-btn">
                    <i className="flaticon-fast-forward-double-right-arrows-symbol"></i> Get in Touch
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
