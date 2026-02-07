import React, { useState, useEffect } from 'react';
import './Hero.css';
import heroImgElectronics from '../assets/images/electronic-home-appliances.png'
const Hero = () => {

  const slides = [
    {
      id: 1,
      title: "Mega Electronics Sale",
      subtitle: "Up to 50% OFF",
      description: "Latest smartphones, laptops & gadgets at unbeatable prices",
      cta: "Shop Now",
      ctaLink: "/shop",
      image: heroImgElectronics,
      badge: "🔥 Hot Deal",
    },
    {
      id: 2,
      title: "New Arrivals",
      subtitle: "Latest Technology",
      description: "Explore cutting-edge gadgets and smart home devices",
      cta: "Discover More",
      ctaLink: "/new-arrivals",
      image: "/hero-images/new-arrivals.jpg",
      badge: "✨ New",
    },
    {
      id: 3,
      title: "Gaming Essentials",
      subtitle: "Level Up Your Setup",
      description: "Premium gaming gear for ultimate performance",
      cta: "View Collection",
      ctaLink: "/gaming",
      image: "/hero-images/gaming.jpg",
      badge: "🎮 Gaming",
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () =>
    setCurrentSlide(prev => (prev + 1) % slides.length);

  const prevSlide = () =>
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="hero">

      <div className="hero-slider">

        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${index === currentSlide ? "active" : ""}`}
          >

            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="hero-bg"
            />

            {/* Overlay */}
            <div className="hero-overlay"></div>

            {/* Content */}
            <div className="hero-content">

              <span className="hero-badge">{slide.badge}</span>

              <h1>{slide.title}</h1>
              <h2>{slide.subtitle}</h2>
              <p>{slide.description}</p>

              <div className="hero-buttons">
                <a href={slide.ctaLink} className="btn-primary">
                  {slide.cta}
                </a>

                <a href="/products" className="btn-secondary">
                  Browse All
                </a>
              </div>

            </div>
          </div>
        ))}

        {/* Arrows */}
        <button className="arrow left" onClick={prevSlide}>‹</button>
        <button className="arrow right" onClick={nextSlide}>›</button>

      </div>

      {/* Trust Bar */}
      <div className="hero-trust">

        <div className="trust-item">
          🚚 Free Delivery above ₹5,000
        </div>

        <div className="trust-item">
          ✅ 100% Genuine Products
        </div>

        <div className="trust-item">
          🔄 Easy Returns
        </div>

        <div className="trust-item">
          🎧 24/7 Support
        </div>

      </div>

    </section>
  );
};

export default Hero;
