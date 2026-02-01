import React from 'react'
import './App.css'
import Header from './components/Header'
import ProductList from './components/ProductList'
import { useState } from 'react'
import {cardContext} from './context/CardContext.js'

function App() {
  const [cartCount,setCartCount] = useState(0)
  return (
    <>
    <cardContext.Provider value={{cartCount,setCartCount}}> 
      <Header />
      <ProductList />
    </cardContext.Provider>
     
      
    </>
  )
}

export default App
