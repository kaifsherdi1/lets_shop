import React from 'react';

/**
 * Shared layout for text-heavy legal / policy pages.
 */
export default function LegalContent({ intro, sections = [] }) {
  const updated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section className="ul-section-spacing">
      <div className="ul-container" style={{ maxWidth: 820 }}>
        <p style={{ color: 'var(--ul-gray)', fontSize: '0.85rem', marginBottom: 24 }}>
          Last updated: {updated}
        </p>

        {intro && (
          <p style={{ color: 'var(--ul-black)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 40 }}>
            {intro}
          </p>
        )}

        {sections.map((s) => (
          <div key={s.h} style={{ marginBottom: 32 }}>
            <h2
              style={{
                fontFamily: 'var(--font-quicksand)',
                fontWeight: 800,
                fontSize: '1.25rem',
                color: 'var(--ul-black)',
                marginBottom: 12,
              }}
            >
              {s.h}
            </h2>
            {s.p.map((para, i) => (
              <p
                key={i}
                style={{ color: 'var(--ul-gray)', lineHeight: 1.8, marginBottom: 12 }}
              >
                {para}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
