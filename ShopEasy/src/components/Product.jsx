import React from 'react'
import { useContext } from 'react'
import { cardContext } from '../context/CardContext'
import { useState } from 'react'

function Product(props) {
  const [productCount,setProductCount] = useState(0)
  const {setCartCount} = useContext(cardContext)
  function increment(){
    setProductCount(prev => prev + 1)
    setCartCount(prev => prev + 1) 
  }
  function decrement(){
    setProductCount((prev)=>{
      if(prev ===0 ){
        return(prev)
      } else{
        return(prev - 1)
      }
    })
    setCartCount((prev)=>{
      if(prev ===0 ){
        return(prev)
      } else{
        return(prev - 1)
      }
    })
  }

  // function incrementCartCount(){
  //   setCartCount((prevCount)=>prevCount + 1)
  // }

  return (
    <div className='product'>
      <img src ={props.image} alt='product image' />
      <h2>{props.name}</h2>
      <p>{props.price}</p>
      {/* <button onClick={incrementCartCount}>Add To Cart</button> */}
      <div className='productCount'>
        <button onClick={decrement}>-</button>
        <p>{productCount}</p>
        <button onClick={increment}>+</button>
      </div>
    </div>
  )
}

export default Product
