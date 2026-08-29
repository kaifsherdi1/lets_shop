import React from 'react';
import PageBanner from '../components/layout/PageBanner';
import { legalBanner } from '../assets/banners';
import LegalContent from '../components/LegalContent';

const SECTIONS = [
  {
    h: 'Accounts',
    p: [
      'You must provide accurate information when creating an account and are responsible for keeping your login credentials secure. You must verify your email address before placing an order.',
      'Distributor and agent accounts are subject to review and may be suspended for policy violations.',
    ],
  },
  {
    h: 'Orders & Pricing',
    p: [
      'All prices are shown in your selected currency (AED or INR) and include applicable tax where indicated. We may correct pricing errors and cancel affected orders with a full refund.',
      'Placing an order is an offer to buy. The contract is formed when we confirm the order by email.',
    ],
  },
  {
    h: 'Payment',
    p: [
      'We accept card payments through our payment provider, cash on delivery, and bank transfer where available. Orders paid by card are confirmed once payment is authorised.',
    ],
  },
  {
    h: 'Shipping & Returns',
    p: [
      'Delivery times are estimates. Risk passes to you on delivery. You may cancel an order while it is still pending or processing.',
      'Faulty or incorrect items can be returned within 14 days of delivery for a refund or replacement.',
    ],
  },
  {
    h: 'Acceptable Use',
    p: [
      'You agree not to misuse the service, attempt to gain unauthorised access, or use automated systems to scrape or overload the platform.',
    ],
  },
  {
    h: 'Liability',
    p: [
      'LetsShop is provided on an "as is" basis. To the extent permitted by law, our liability for any claim relating to an order is limited to the amount you paid for that order.',
    ],
  },
  {
    h: 'Contact',
    p: ['Questions about these terms? Email support@letsshop.com.'],
  },
];

export default function Terms() {
  return (
    <main>
      <PageBanner title="Terms & Conditions" crumbs={[{ label: 'Terms & Conditions' }]} bg={legalBanner} />
      <LegalContent
        intro="These terms govern your use of the LetsShop storefront and your purchases. By creating an account or placing an order you agree to them."
        sections={SECTIONS}
      />
    </main>
  );
}
