import React from 'react'
import About from '../components/About'
import Categories from '../components/Categories'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import FeaturedProducts from '../components/FeaturedProducts'
import BrandShowcase from '../components/BrandShowcase'
import SpecialDeals from '../components/SpecialDeals'
import Newsletter from '../components/Newsletter'
import Header from '../components/Header/Header'
import Brands from '../components/Brands'


function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <FeaturedProducts />
      <BrandShowcase />
      <SpecialDeals />
      <Newsletter />
      <Footer />
    </div>
  )
}

export default Home
