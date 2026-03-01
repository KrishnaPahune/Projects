import React, { useEffect, useState } from "react";
import "./ProductListing.css";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

// Import all product images
import LGOLed55 from "../assets/images/LGOLed55.jpg";
import tv2 from "../assets/images/tv2.avif";
import tv3 from "../assets/images/tv3.jpeg";
import fridge1 from "../assets/images/fridge1.png";
import fridge2 from "../assets/images/fridge2.jpg";
import wm1 from "../assets/images/wm1.jpg";
import wm2 from "../assets/images/wm2.webp";
import ac1 from "../assets/images/ac1.webp";

// Map image filenames to imported modules
const imageMap = {
  "LGOLed55.jpg": LGOLed55,
  "tv2.avif": tv2,
  "tv3.jpeg": tv3,
  "fridge1.png": fridge1,
  "fridge2.jpg": fridge2,
  "wm1.jpg": wm1,
  "wm2.webp": wm2,
  "ac1.webp": ac1,
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// Fetch products from backend and normalize to UI shape
const getProducts = async () => {
  const res = await fetch(`${BACKEND_URL}/api/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();

  // Map backend product fields to the UI expected fields
  return data.map((p) => ({
    id: p.id,
    name: p.name,
    brand: p.category || "",
    category: p.category || "",
    price: p.price,
    // Keep an originalPrice slightly higher for UI discount badge
    originalPrice: Math.round(p.price * 1.12),
    rating: +(Math.random() * (4.8 - 3.6) + 3.6).toFixed(1),
    reviews: Math.floor(Math.random() * 500) + 10,
    // Map image filename to imported image module
    image: imageMap[p.image] || imageMap["tv2.avif"],
    description: p.description || "",
    stock: p.stock ?? 0,
  }));
};

//////////////////////////////////////////////////////////////

const RatingStars = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<span key={i}>⭐</span>);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<span key={i}>⭐</span>);
    } else {
      stars.push(<span key={i}>☆</span>);
    }
  }
  return <div className="rating-stars">{stars}</div>;
};

const ProductCard = ({ product, openProduct }) => {
  const { showToast } = useToast();
  const { addToCart } = useCart();
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="product-card" onClick={() => openProduct(product)}>
      <div className="product-image-wrapper">
        <img src={product.image} alt={product.name} />
        <div className="discount-badge">{discount}% off</div>
      </div>

      <div className="product-info">
        <p className="product-brand">{product.brand}</p>
        <h3 className="product-name">{product.name}</h3>

        <div className="product-rating">
          <RatingStars rating={product.rating} />
          <span className="rating-text">({product.reviews})</span>
        </div>

        <div className="price-row">
          <span className="price">₹{product.price.toLocaleString()}</span>
          <span className="original-price">
            ₹{product.originalPrice.toLocaleString()}
          </span>
        </div>

        <button
          className="add-to-cart-btn"
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
            showToast("Item added to cart 🛒");
          }}
        >
          🛒 Add to Cart
        </button>
      </div>
    </div>
  );
};

//////////////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////////////

export default function ProductListing({
  goHome,
  openProduct,
  goToCart,
  product,
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popularity");

  // Filters state
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 150000]);
  const [selectedRatings, setSelectedRatings] = useState([]);

  const { cartItems, cartCount, cartTotal, addToCart } = useCart();

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  // Get unique categories, brands for filter options
  const categories = [...new Set(products.map((p) => p.category))];
  const brands = [...new Set(products.map((p) => p.brand))].sort();

  // Apply all filters and search
  let filteredProducts = products.filter((product) => {
    // Search filter
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);

    // Brand filter
    const matchesBrand =
      selectedBrands.length === 0 || selectedBrands.includes(product.brand);

    // Price filter
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    // Rating filter
    const matchesRating =
      selectedRatings.length === 0 ||
      selectedRatings.some((rating) => product.rating >= rating);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesBrand &&
      matchesPrice &&
      matchesRating
    );
  });

  // Apply sorting
  if (sortBy === "price-low-high") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high-low") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "newest") {
    filteredProducts = [...filteredProducts].reverse();
  }
  // popularity is default (no sorting needed)

  // Toggle category filter
  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Toggle brand filter
  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  // Toggle rating filter
  const toggleRating = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 150000]);
    setSelectedRatings([]);
    setSearchQuery("");
    setSortBy("popularity");
  };

  // Count active filters
  const activeFiltersCount =
    selectedCategories.length +
    selectedBrands.length +
    selectedRatings.length +
    (searchQuery ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 150000 ? 1 : 0);

  return (
    <div className="plp-page">
      <div className="plp-container">
        {/* HEADER */}
        <div className="plp-header">
          <button className="back-btn" onClick={goHome}>
            ← Back
          </button>

          <input
            type="text"
            className="search-bar"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="header-actions">
            <select
              className="sort-dropdown"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popularity">Sort by: Popularity</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>

            <button
              className="filter-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              🔍 Filters
              {activeFiltersCount > 0 && (
                <span className="filter-badge">{activeFiltersCount}</span>
              )}
            </button>

            <button
              className="action-btn cart-button"
              onClick={(e) => {
                e.stopPropagation();
                goToCart();
              }}
            >
              <span className="action-icon">🛒</span>

              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}

              {cartCount > 0 && (
                <span className="cart-total">
                  ₹ {cartTotal.toLocaleString("en-IN")}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ACTIVE FILTERS TAGS */}
        {activeFiltersCount > 0 && (
          <div className="active-filters">
            {searchQuery && (
              <div className="filter-tag">
                🔍 "{searchQuery}"
                <button onClick={() => setSearchQuery("")}>✕</button>
              </div>
            )}
            {selectedCategories.map((cat) => (
              <div key={cat} className="filter-tag">
                {cat}
                <button onClick={() => toggleCategory(cat)}>✕</button>
              </div>
            ))}
            {selectedBrands.map((brand) => (
              <div key={brand} className="filter-tag">
                {brand}
                <button onClick={() => toggleBrand(brand)}>✕</button>
              </div>
            ))}
            {selectedRatings.map((rating) => (
              <div key={rating} className="filter-tag">
                {rating}★ & up
                <button onClick={() => toggleRating(rating)}>✕</button>
              </div>
            ))}
            {(priceRange[0] > 0 || priceRange[1] < 150000) && (
              <div className="filter-tag">
                ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                <button onClick={() => setPriceRange([0, 150000])}>✕</button>
              </div>
            )}
            <button className="clear-all-btn" onClick={clearAllFilters}>
              Clear All
            </button>
          </div>
        )}

        {/* LAYOUT */}
        <div className={`plp-layout ${!showFilters ? "filters-hidden" : ""}`}>
          <aside className={`filters-sidebar ${showFilters ? "open" : ""}`}>
            <div className="filters-header">
              <h2>Filters</h2>
              <button
                className="close-filters"
                onClick={() => setShowFilters(false)}
              >
                ✕
              </button>
            </div>

            {/* Price Range Filter */}
            <div className="filter-group">
              <h3>PRICE RANGE</h3>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                  }
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value) || 150000])
                  }
                />
              </div>
              <input
                type="range"
                min="0"
                max="150000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="price-slider"
              />
              <div className="price-display">
                ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
              </div>
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <h3>CATEGORY</h3>
              {categories.map((category) => (
                <label key={category}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                  />
                  {category}
                </label>
              ))}
            </div>

            {/* Brand Filter */}
            <div className="filter-group">
              <h3>BRAND</h3>
              {brands.map((brand) => (
                <label key={brand}>
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                  />
                  {brand}
                </label>
              ))}
            </div>

            {/* Rating Filter */}
            <div className="filter-group">
              <h3>RATING</h3>
              {[4, 3, 2, 1].map((rating) => (
                <label key={rating}>
                  <input
                    type="checkbox"
                    checked={selectedRatings.includes(rating)}
                    onChange={() => toggleRating(rating)}
                  />
                  <span className="rating-label">
                    {Array(rating)
                      .fill(0)
                      .map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    {rating}+ Stars
                  </span>
                </label>
              ))}
            </div>
          </aside>

          {/* PRODUCTS */}
          <div className="products-section">
            <p className="product-count">
              {loading
                ? "Loading products..."
                : `Showing ${filteredProducts.length} of ${products.length} products`}
            </p>

            {filteredProducts.length === 0 && !loading ? (
              <div className="no-products">
                <div className="no-products-icon">🔍</div>
                <p>No products found matching your filters</p>
                <button className="clear-all-btn" onClick={clearAllFilters}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="product-grid">
                {loading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))
                  : filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        openProduct={openProduct}
                      />
                    ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter overlay */}
      {showFilters && (
        <div
          className="filter-overlay"
          onClick={() => setShowFilters(false)}
        />
      )}
    </div>
  );
}
