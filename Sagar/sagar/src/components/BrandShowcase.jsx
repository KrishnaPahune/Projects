import React from 'react';
import './BrandShowcase.css';

const BrandShowcase = () => {
  const brands = [
    {
      id: 1,
      name: 'Apple',
      logo: '/brands/apple.svg',
      productsCount: 156,
      link: '/brand/apple'
    },
    {
      id: 2,
      name: 'Samsung',
      logo: '/brands/samsung.svg',
      productsCount: 243,
      link: '/brand/samsung'
    },
    {
      id: 3,
      name: 'Sony',
      logo: '/brands/sony.svg',
      productsCount: 187,
      link: '/brand/sony'
    },
    {
      id: 4,
      name: 'Dell',
      logo: '/brands/dell.svg',
      productsCount: 124,
      link: '/brand/dell'
    },
    {
      id: 5,
      name: 'HP',
      logo: '/brands/hp.svg',
      productsCount: 198,
      link: '/brand/hp'
    },
    {
      id: 6,
      name: 'LG',
      logo: '/brands/lg.svg',
      productsCount: 167,
      link: '/brand/lg'
    },
    {
      id: 7,
      name: 'Canon',
      logo: '/brands/canon.svg',
      productsCount: 89,
      link: '/brand/canon'
    },
    {
      id: 8,
      name: 'Nikon',
      logo: '/brands/nikon.svg',
      productsCount: 76,
      link: '/brand/nikon'
    },
    {
      id: 9,
      name: 'Bose',
      logo: '/brands/bose.svg',
      productsCount: 54,
      link: '/brand/bose'
    },
    {
      id: 10,
      name: 'JBL',
      logo: '/brands/jbl.svg',
      productsCount: 92,
      link: '/brand/jbl'
    },
    {
      id: 11,
      name: 'Lenovo',
      logo: '/brands/lenovo.svg',
      productsCount: 156,
      link: '/brand/lenovo'
    },
    {
      id: 12,
      name: 'Asus',
      logo: '/brands/asus.svg',
      productsCount: 134,
      link: '/brand/asus'
    }
  ];

  return (
    <section className="brand-showcase">
      <div className="brand-container">
        {/* Section Header */}
        <div className="brand-header">
          <div className="header-left">
            <h2 className="brand-title">Shop by Brand</h2>
            <p className="brand-subtitle">Explore products from world's leading electronics brands</p>
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
                <div className="brand-logo-placeholder">
                  <span className="brand-name-text">{brand.name}</span>
                </div>
              </div>
              <div className="brand-info">
                <span className="products-count">{brand.productsCount} Products</span>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="brand-cta-section">
          <div className="cta-content">
            <h3 className="cta-title">Can't find your favorite brand?</h3>
            <p className="cta-text">We're constantly adding new brands. Check back soon or contact us for special requests.</p>
            <a href="/contact" className="cta-button">Request a Brand</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;
