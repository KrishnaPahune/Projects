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


function Home({ goToListing }) {
  return (
    <div>
      <Header />
      <Hero goToListing={goToListing} goHome={() => setPage("home")} />
      <FeaturedProducts goToListing={goToListing} goHome={() => setPage("home")} />
      <BrandShowcase />
      <SpecialDeals />
      <Newsletter />
      <Footer />
    </div>
  )
}

export default Home
