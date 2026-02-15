import React, { useState } from "react";
import "./FeaturedProducts.css";
import tv1 from "../assets/images/LGOLed55.jpg";
import tv2 from "../assets/images/tv2.avif";
import tv3 from "../assets/images/tv3.jpeg";
import fridge1 from "../assets/images/fridge1.png";
import fridge2 from "../assets/images/fridge2.jpg";
import wm1 from "../assets/images/wm1.jpg";
import wm2 from "../assets/images/wm2.webp";
import ac1 from "../assets/images/ac1.webp";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

const FeaturedProducts = ({ goToListing, goHome, openProduct }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("trending");
  const { addToCart } = useCart();

  // Sample product data - replace with actual data from your API/database
  const products = {
    trending: [
      {
        id: 1,
        name: "LG OLED55C2 Smart TV",
        category: "Smart TVs",
        price: 119900,
        originalPrice: 149900,
        image: tv1,
        rating: 4.8,
        reviews: 145,
        badge: "Trending",
        inStock: true,
      },
      {
        id: 2,
        name: 'Samsung QLED 65" QN90B',
        category: "Smart TVs",
        price: 159900,
        originalPrice: 189900,
        image: tv2,
        rating: 4.7,
        reviews: 98,
        badge: "Hot",
        inStock: true,
      },
      {
        id: 3,
        name: "Sony Bravia 55X90J",
        category: "Smart TVs",
        price: 99900,
        originalPrice: 119900,
        image: tv3,
        rating: 4.6,
        reviews: 76,
        badge: "Popular",
        inStock: true,
      },
      {
        id: 4,
        name: "Whirlpool 285L Neo Frost Refrigerator",
        category: "Refrigerators",
        price: 36990,
        originalPrice: 41990,
        image: fridge1,
        rating: 4.5,
        reviews: 210,
        badge: "Best Seller",
        inStock: true,
      },
      {
        id: 5,
        name: "LG 260L Frost-Free Refrigerator",
        category: "Refrigerators",
        price: 34990,
        originalPrice: 39990,
        image: fridge2,
        rating: 4.4,
        reviews: 134,
        badge: null,
        inStock: true,
      },
      {
        id: 6,
        name: "IFB 8kg Front Load Washing Machine",
        category: "Washing Machines",
        price: 27990,
        originalPrice: 32990,
        image: wm1,
        rating: 4.6,
        reviews: 98,
        badge: "New",
        inStock: true,
      },
      {
        id: 7,
        name: "Samsung 7.5kg Fully-Automatic Washing Machine",
        category: "Washing Machines",
        price: 19990,
        originalPrice: 24990,
        image: wm2,
        rating: 4.3,
        reviews: 64,
        badge: null,
        inStock: true,
      },
      {
        id: 8,
        name: "Daikin 1.5 Ton Inverter AC",
        category: "Air Conditioners",
        price: 39990,
        originalPrice: 44990,
        image: ac1,
        rating: 4.7,
        reviews: 187,
        badge: "Energy Saver",
        inStock: true,
      },
    ],
    newArrivals: [
      // You can add different products for new arrivals
      // For now, using same array
    ],
    deals: [
      // Products with best discounts
    ],
  };

  const calculateDiscount = (original, current) => {
    return Math.round(((original - current) / original) * 100);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
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
            <p className="section-subtitle">
              Handpicked collection of premium electronics
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button
              className={`tab-btn ${activeTab === "trending" ? "active" : ""}`}
              onClick={() => setActiveTab("trending")}
            >
              🔥 Trending
            </button>
            <button
              className={`tab-btn ${activeTab === "newArrivals" ? "active" : ""}`}
              onClick={() => setActiveTab("newArrivals")}
            >
              ✨ New Arrivals
            </button>
            <button
              className={`tab-btn ${activeTab === "deals" ? "active" : ""}`}
              onClick={() => setActiveTab("deals")}
            >
              💰 Best Deals
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => openProduct(product)}
            >
              {/* Product Badge */}
              {product.badge && (
                <div className="product-badge">{product.badge}</div>
              )}

              {/* Product Image */}
              <div className="product-image-container">
                <div className="product-image">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-img"
                  />
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
                    {"⭐".repeat(Math.floor(product.rating))}
                  </div>
                  <span className="rating-text">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="product-pricing">
                  <div className="price-row">
                    <span className="current-price">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="original-price">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  {product.originalPrice > product.price && (
                    <span className="discount-badge">
                      {calculateDiscount(product.originalPrice, product.price)}%
                      OFF
                    </span>
                  )}
                </div>

                {/* Add to Cart */}
                <button
                  className="add-to-cart-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                    showToast("Item added to cart 🛒");
                    console.log(product)
                  }}
                >
                  <span className="cart-icon">🛒</span>
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="view-all-container">
          <a className="view-all-btn" onClick={goToListing}>
            <span>View All Products</span>
            <span className="arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
