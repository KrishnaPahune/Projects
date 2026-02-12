import "./ProductDetail.css";
import { useEffect } from "react";

export default function ProductDetail({ product, goBack }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return <h2 style={{ padding: "40px" }}>Product not found</h2>;
  }

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );

  return (
    <div className="pd-page">
      <div className="pd-container">
        <button className="back-btn" onClick={goBack}>
          ← Back
        </button>

        <div className="pd-layout">
          {/* IMAGE */}
          <div className="pd-image-box">
            <img src={product.image} alt={product.name} />
          </div>

          {/* INFO */}
          <div className="pd-info">
            <p className="pd-brand">{product.brand}</p>

            <h1 className="pd-title">{product.name}</h1>

            <div className="pd-price-row">
              <span className="pd-price">
                ₹{product.price.toLocaleString()}
              </span>

              <span className="pd-original">
                ₹{product.originalPrice.toLocaleString()}
              </span>

              <span className="pd-discount">{discount}% OFF</span>
            </div>

            <p className="pd-stock">✅ In Stock</p>

            {/* CTA */}
            <div className="pd-actions">
              <button className="btn-add">Add to Cart</button>

              <button className="btn-buy">Buy Now</button>
            </div>

            {/* FEATURES */}
            <ul className="pd-features">
              <li>✔ Official Brand Warranty</li>
              <li>✔ Free Delivery</li>
              <li>✔ Installation Available</li>
              <li>✔ Trusted Store Purchase</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
