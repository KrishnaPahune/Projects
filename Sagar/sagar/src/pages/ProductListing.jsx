import React, { useEffect, useState } from "react";
import "./ProductListing.css";

// Fake API simulation
const getProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "Samsung 55” 4K Smart TV",
          brand: "Samsung",
          price: 54999,
          originalPrice: 69999,
          image:
            "https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=1200",
        },
        {
          id: 2,
          name: "LG Double Door Refrigerator",
          brand: "LG",
          price: 38999,
          originalPrice: 45999,
          image:
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200",
        },
        {
          id: 3,
          name: "Sony Bravia OLED",
          brand: "Sony",
          price: 129999,
          originalPrice: 149999,
          image:
            "https://images.unsplash.com/photo-1601944179066-29786cb9d32a?q=80&w=1200",
        },
        {
          id: 4,
          name: "Whirlpool Washing Machine",
          brand: "Whirlpool",
          price: 24999,
          originalPrice: 29999,
          image:
            "https://images.unsplash.com/photo-1626808642875-0aa545482dfb?q=80&w=1200",
        },
        {
          id: 5,
          name: "Panasonic 1.5 Ton AC",
          brand: "Panasonic",
          price: 41999,
          originalPrice: 48999,
          image:
            "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1200",
        },
        {
          id: 6,
          name: "Bosch Front Load Washer",
          brand: "Bosch",
          price: 52999,
          originalPrice: 59999,
          image:
            "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1200",
        },
      ]);
    }, 700);
  });
};

const ProductCard = ({ product, openProduct }) => {
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );

  return (
    <div className="product-card" onClick={() => openProduct(product)}>
      <div className="product-image-wrapper">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-info">
        <p className="product-brand">{product.brand}</p>
        <h3 className="product-name">{product.name}</h3>

        <div className="price-row">
          <span className="price">₹{product.price.toLocaleString()}</span>
          <span className="original-price">
            ₹{product.originalPrice.toLocaleString()}
          </span>
          <span className="discount">{discount}% off</span>
        </div>
        <button
          className="add-to-cart-btn"
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
        >
          <span className="cart-icon">🛒</span>
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-image" />
    <div className="skeleton-lines">
      <div />
      <div />
      <div />
    </div>
  </div>
);

export default function ProductListing({ goHome, openProduct }) {
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="plp-page">
      <div className="plp-container">
        <div className="plp-header">
          <button className="back-btn" onClick={goHome}>
            ← Back
          </button>
          <button className="filter-btn" onClick={() => setShowFilters(true)}>
            Filters
          </button>
          <h1>Explore Premium Electronics</h1>

          <select className="sort-dropdown">
            <option>Sort by: Popularity</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
        </div>

        <div className="plp-layout">
          <aside className={`filters-sidebar ${showFilters ? "open" : ""}`}>
            <button
              className="close-filters"
              onClick={() => setShowFilters(false)}
            >
              ✕
            </button>
            <div className="filter-group">
              <h2>CATEGORY</h2>
              {[
                "Television",
                "Refrigerator",
                "Washing Machine",
                "Air Conditioner",
              ].map((item) => (
                <label key={item}>
                  <input type="checkbox" />
                  {item}
                </label>
              ))}
            </div>

            <div className="filter-group">
              <h2>BRAND</h2>
              {["Samsung", "LG", "Sony", "Bosch"].map((item) => (
                <label key={item}>
                  <input type="checkbox" />
                  {item}
                </label>
              ))}
            </div>
          </aside>

          <div className="products-section">
            <p className="product-count">
              Showing {loading ? "..." : products.length} products
            </p>

            <div className="product-grid">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))
                : products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      openProduct={openProduct}
                    />
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
