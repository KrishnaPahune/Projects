import React, { useState, useEffect } from "react";
import "./SpecialDeals.css";
import tv1 from "../assets/images/LGOLed55.jpg";
import fridge1 from "../assets/images/fridge1.png";
import wm1 from "../assets/images/wm1.jpg";
const SpecialDeals = () => {
  // Countdown timer for limited offer
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        let { hours, minutes, seconds } = prevTime;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const deals = [
    {
      id: 1,
      title: "Flash Deal",
      product: "LG OLED55C2 Smart TV",
      originalPrice: 149900,
      dealPrice: 119900,
      discount: 20,
      image: tv1,
      badge: "🔥 Hot",
      stockLeft: 6,
    },
    {
      id: 2,
      title: "Weekend Special",
      product: "Whirlpool 285L Neo Frost Refrigerator",
      originalPrice: 41990,
      dealPrice: 36990,
      discount: 12,
      image: fridge1,
      badge: "⚡ Limited",
      stockLeft: 10,
    },
    {
      id: 3,
      title: "Clearance Sale",
      product: "IFB 8kg Front Load Washing Machine",
      originalPrice: 32990,
      dealPrice: 27990,
      discount: 15,
      image: wm1,
      badge: "💰 Save Big",
      stockLeft: 14,
    },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatTime = (num) => {
    return num.toString().padStart(2, "0");
  };

  return (
    <section className="special-deals">
      <div className="deals-container">
        {/* Section Header with Countdown */}
        <div className="deals-header">
          <div className="header-content">
            <span className="deals-badge">Limited Time Offers</span>
            <h2 className="deals-title">Today's Special Deals</h2>
            <p className="deals-subtitle">
              Grab these amazing offers before they're gone!
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="countdown-timer">
            <div className="timer-label">Offer ends in:</div>
            <div className="timer-display">
              <div className="time-unit">
                <span className="time-number">
                  {formatTime(timeLeft.hours)}
                </span>
                <span className="time-label">Hours</span>
              </div>
              <span className="time-separator">:</span>
              <div className="time-unit">
                <span className="time-number">
                  {formatTime(timeLeft.minutes)}
                </span>
                <span className="time-label">Minutes</span>
              </div>
              <span className="time-separator">:</span>
              <div className="time-unit">
                <span className="time-number">
                  {formatTime(timeLeft.seconds)}
                </span>
                <span className="time-label">Seconds</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="deals-grid">
          {deals.map((deal) => (
            <div key={deal.id} className="deal-card">
              <div className="deal-badge">{deal.badge}</div>

              {/* Deal Image */}
              <div className="deal-image">
                <img src={deal.image} alt={deal.product} className="brand-logo" />
                <div className="discount-circle">
                  <span className="discount-number">{deal.discount}%</span>
                  <span className="discount-text">OFF</span>
                </div>
              </div>

              {/* Deal Info */}
              <div className="deal-info">
                <h3 className="deal-product-name">{deal.product}</h3>

                <div className="deal-pricing">
                  <div className="price-row">
                    <span className="deal-price">
                      {formatPrice(deal.dealPrice)}
                    </span>
                    <span className="original-price-deal">
                      {formatPrice(deal.originalPrice)}
                    </span>
                  </div>
                  <div className="savings">
                    You save {formatPrice(deal.originalPrice - deal.dealPrice)}
                  </div>
                </div>

                {/* Stock Indicator */}
                <div className="stock-indicator">
                  <div className="stock-bar">
                    <div
                      className="stock-fill"
                      style={{ width: `${(deal.stockLeft / 50) * 100}%` }}
                    ></div>
                  </div>
                  <span className="stock-text">
                    Only {deal.stockLeft} left in stock!
                  </span>
                </div>

                {/* CTA Button */}
                <button className="claim-deal-btn">
                  <span>Claim Deal</span>
                  <span className="btn-arrow">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Deals */}
        <div className="view-all-deals-container">
          <a href="/deals" className="view-all-deals-btn">
            View All Special Offers
          </a>
        </div>
      </div>
    </section>
  );
};

export default SpecialDeals;
