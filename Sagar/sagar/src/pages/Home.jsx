import React from 'react'
import About from '../components/About'
import Categories from '../components/Categories'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import Header from '../components/Header/Header'
import Brands from '../components/Brands'


function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <Categories />
      <Brands />
      <About />   
      <Contact />
      <Footer />
    </div>
  )
}

export default Home
