import React from 'react';
import PageBanner from '../components/layout/PageBanner';
import { legalBanner } from '../assets/banners';
import LegalContent from '../components/LegalContent';

const SECTIONS = [
  {
    h: 'Information We Collect',
    p: [
      'When you create an account we collect your name, email address, phone number and a securely hashed password. When you place an order we also collect your delivery address, recipient details and order history.',
      'We store technical data such as your IP address and browser type for security, fraud prevention and to keep the service reliable.',
    ],
  },
  {
    h: 'How We Use Your Information',
    p: [
      'To process and deliver your orders, send order confirmations and one-time verification codes, provide customer support, and — where you have opted in — send you product updates and offers.',
      'We never sell your personal data. We share it only with service providers that help us operate the store (payment processing, email delivery, hosting) and only to the extent needed to provide that service.',
    ],
  },
  {
    h: 'Payments',
    p: [
      'Card payments are handled by our payment provider. LetsShop does not see or store your full card number, CVV or PIN.',
    ],
  },
  {
    h: 'Your Rights',
    p: [
      'You can view and update your profile at any time from your account page. To request a copy of your data or deletion of your account, contact us at privacy@letsshop.com and we will respond within 30 days.',
    ],
  },
  {
    h: 'Cookies',
    p: [
      'We use a small amount of local browser storage to keep you signed in and remember your currency preference. We do not use third-party advertising cookies.',
    ],
  },
  {
    h: 'Contact',
    p: ['Questions about this policy? Email privacy@letsshop.com.'],
  },
];

export default function Privacy() {
  return (
    <main>
      <PageBanner title="Privacy Policy" crumbs={[{ label: 'Privacy Policy' }]} bg={legalBanner} />
      <LegalContent
        intro="This policy explains what personal information LetsShop collects, how we use it, and the choices you have. It applies to the LetsShop storefront and account services."
        sections={SECTIONS}
      />
    </main>
  );
}
