import React from 'react'
import About from '../components/About'
import Categories from '../components/Categories'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Categories from '../components/Categories'
import Brands from '../components/Brands'


function Home() {
  return (
    <div>
      <Navbar />
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
