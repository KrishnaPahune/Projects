import React from "react";
import "./BrandShowcase.css";
import samsung from "../assets/images/samsung-logo.png";
import lg from "../assets/images/lg-logo.png";
import sony from "../assets/images/sony-logo.jpg";
import whirlpool from "../assets/images/whirlpool-logo.png";
import ifb from "../assets/images/ifb-logo.png";
import daikin from "../assets/images/daikin-logo.webp";
import panasonic from "../assets/images/panasonic-logo.png";
import haier from "../assets/images/haier-logo.webp";
import bosch from "../assets/images/bosch-logo.webp";
import godrej from "../assets/images/godrej-logo.jpg";
import voltas from "../assets/images/voltas-logo.webp";
import hitachi from "../assets/images/hitachi-logo.jpeg";

const BrandShowcase = () => {
  const brands = [
    {
      id: 1,
      name: "LG",
      logo: lg,
      productsCount: 167,
      link: "/brand/lg",
    },
    {
      id: 2,
      name: "Samsung",
      logo: samsung,
      productsCount: 243,
      link: "/brand/samsung",
    },
    {
      id: 3,
      name: "Sony",
      logo: sony,
      productsCount: 187,
      link: "/brand/sony",
    },
    {
      id: 4,
      name: "Whirlpool",
      logo: whirlpool,
      productsCount: 210,
      link: "/brand/whirlpool",
    },
    {
      id: 5,
      name: "IFB",
      logo: ifb,
      productsCount: 98,
      link: "/brand/ifb",
    },
    {
      id: 6,
      name: "Daikin",
      logo: daikin,
      productsCount: 134,
      link: "/brand/daikin",
    },
    {
      id: 7,
      name: "Panasonic",
      logo: panasonic,
      productsCount: 120,
      link: "/brand/panasonic",
    },
    {
      id: 8,
      name: "Haier",
      logo: haier,
      productsCount: 88,
      link: "/brand/haier",
    },
    {
      id: 9,
      name: "Bosch",
      logo: bosch,
      productsCount: 92,
      link: "/brand/bosch",
    },
    {
      id: 10,
      name: "Godrej",
      logo: godrej,
      productsCount: 76,
      link: "/brand/godrej",
    },
    {
      id: 11,
      name: "Voltas",
      logo: voltas,
      productsCount: 140,
      link: "/brand/voltas",
    },
    {
      id: 12,
      name: "Hitachi",
      logo: hitachi,
      productsCount: 64,
      link: "/brand/hitachi",
    },
  ];

  return (
    <section className="brand-showcase">
      <div className="brand-container">
        {/* Section Header */}
        <div className="brand-header">
          <div className="header-left">
            <h2 className="brand-title">Shop by Brand</h2>
            <p className="brand-subtitle">
              Explore products from world's leading electronics brands
            </p>
          </div>
          <a href="/brands" className="view-all-brands">
            View All Brands →
          </a>
        </div>

        {/* Brands Grid */}
        <div className="brands-grid">
          {brands.map((brand) => (
            <a
              key={brand.id}
              href={brand.link}
              className="brand-card"
              aria-label={`Shop ${brand.name} products`}
            >
              <div className="brand-logo-container">
                {/* Placeholder for logo - replace with actual logo */}
                <img src={brand.logo} alt={brand.name} className="brand-logo" />
              </div>
              <div className="brand-info">
                <span className="products-count">
                  {brand.productsCount} Products
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="brand-cta-section">
          <div className="cta-content">
            <h3 className="cta-title">Can't find your favorite brand?</h3>
            <p className="cta-text">
              We're constantly adding new brands. Check back soon or contact us
              for special requests.
            </p>
            <a href="/contact" className="cta-button">
              Request a Brand
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;
