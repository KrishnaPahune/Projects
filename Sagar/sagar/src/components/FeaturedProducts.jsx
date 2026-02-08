import React, { useState } from 'react';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  const [activeTab, setActiveTab] = useState('trending');

  // Sample product data - replace with actual data from your API/database
  const products = {
    trending: [
      {
        id: 1,
        name: 'iPhone 15 Pro Max',
        category: 'Smartphones',
        price: 134900,
        originalPrice: 159900,
        image: '/products/iphone-15.jpg',
        rating: 4.8,
        reviews: 234,
        badge: 'Trending',
        inStock: true
      },
      {
        id: 2,
        name: 'Samsung Galaxy S24 Ultra',
        category: 'Smartphones',
        price: 129999,
        originalPrice: 144999,
        image: '/products/samsung-s24.jpg',
        rating: 4.7,
        reviews: 189,
        badge: 'Hot',
        inStock: true
      },
      {
        id: 3,
        name: 'MacBook Air M3',
        category: 'Laptops',
        price: 114900,
        originalPrice: 124900,
        image: '/products/macbook-air.jpg',
        rating: 4.9,
        reviews: 456,
        badge: 'Popular',
        inStock: true
      },
      {
        id: 4,
        name: 'Sony WH-1000XM5',
        category: 'Headphones',
        price: 29990,
        originalPrice: 34990,
        image: '/products/sony-headphones.jpg',
        rating: 4.8,
        reviews: 312,
        badge: 'Best Seller',
        inStock: true
      },
      {
        id: 5,
        name: 'iPad Pro 12.9"',
        category: 'Tablets',
        price: 109900,
        originalPrice: 119900,
        image: '/products/ipad-pro.jpg',
        rating: 4.7,
        reviews: 167,
        badge: null,
        inStock: true
      },
      {
        id: 6,
        name: 'Dell XPS 15',
        category: 'Laptops',
        price: 154900,
        originalPrice: 174900,
        image: '/products/dell-xps.jpg',
        rating: 4.6,
        reviews: 98,
        badge: null,
        inStock: true
      },
      {
        id: 7,
        name: 'Canon EOS R6 Mark II',
        category: 'Cameras',
        price: 239900,
        originalPrice: 259900,
        image: '/products/canon-r6.jpg',
        rating: 4.9,
        reviews: 87,
        badge: 'New',
        inStock: true
      },
      {
        id: 8,
        name: 'Apple Watch Series 9',
        category: 'Wearables',
        price: 41900,
        originalPrice: 45900,
        image: '/products/apple-watch.jpg',
        rating: 4.8,
        reviews: 201,
        badge: null,
        inStock: true
      }
    ],
    newArrivals: [
      // You can add different products for new arrivals
      // For now, using same array
    ],
    deals: [
      // Products with best discounts
    ]
  };

  const calculateDiscount = (original, current) => {
    return Math.round(((original - current) / original) * 100);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const currentProducts = products[activeTab] || products.trending;

  return (
    <section className="featured-products">
      <div className="featured-container">
        {/* Section Header */}
        <div className="featured-header">
          <div className="header-content">
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Handpicked collection of premium electronics</p>
          </div>
          
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button 
              className={`tab-btn ${activeTab === 'trending' ? 'active' : ''}`}
              onClick={() => setActiveTab('trending')}
            >
              🔥 Trending
            </button>
            <button 
              className={`tab-btn ${activeTab === 'newArrivals' ? 'active' : ''}`}
              onClick={() => setActiveTab('newArrivals')}
            >
              ✨ New Arrivals
            </button>
            <button 
              className={`tab-btn ${activeTab === 'deals' ? 'active' : ''}`}
              onClick={() => setActiveTab('deals')}
            >
              💰 Best Deals
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {currentProducts.map((product) => (
            <div key={product.id} className="product-card">
              {/* Product Badge */}
              {product.badge && (
                <div className="product-badge">{product.badge}</div>
              )}

              {/* Product Image */}
              <div className="product-image-container">
                <div className="product-image">
                  {/* Placeholder with gradient - replace with actual image */}
                  <div className="image-placeholder">
                    <span className="placeholder-text">{product.name}</span>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="product-actions">
                  <button className="action-icon" aria-label="Add to wishlist">
                    ❤️
                  </button>
                  <button className="action-icon" aria-label="Quick view">
                    👁️
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
                
                {/* Rating */}
                <div className="product-rating">
                  <div className="stars">
                    {'⭐'.repeat(Math.floor(product.rating))}
                  </div>
                  <span className="rating-text">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="product-pricing">
                  <div className="price-row">
                    <span className="current-price">{formatPrice(product.price)}</span>
                    {product.originalPrice > product.price && (
                      <span className="original-price">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>
                  {product.originalPrice > product.price && (
                    <span className="discount-badge">
                      {calculateDiscount(product.originalPrice, product.price)}% OFF
                    </span>
                  )}
                </div>

                {/* Add to Cart */}
                <button className="add-to-cart-btn">
                  <span className="cart-icon">🛒</span>
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="view-all-container">
          <a href="/products" className="view-all-btn">
            <span>View All Products</span>
            <span className="arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
