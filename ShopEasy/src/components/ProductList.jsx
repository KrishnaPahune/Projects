import React from 'react'
import Product from './Product'
import './ProductList.css'
import products from '../products'

function ProductList() {
  return (
    <div className='container'>
    {products.map((product,index)=>{
      return(
        <Product key={index} 
        name={product.name}
         price ={product.price} 
         image={product.image}
         />
      )
    })}
    </div>
  )
}

export default ProductList
