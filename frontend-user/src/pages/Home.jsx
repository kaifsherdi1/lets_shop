import React from 'react';
import Hero from '../components/home/Hero';
import AboutSection from '../components/home/AboutSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import Categories from '../components/home/Categories';
import PromoBanner from '../components/home/PromoBanner';
import InfoSection from '../components/home/InfoSection';
import Testimonials from '../components/home/Testimonials';
import '../components/home/HomeSections.css';

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedProducts />
      <Categories />
      <PromoBanner />
      <InfoSection />
      <AboutSection />
      <Testimonials />
    </main>
  );
}
