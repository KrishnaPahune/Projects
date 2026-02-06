import React, { useState } from 'react';
import './BottomBar.css';

const BottomBar = () => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  const categories = [
    { name: 'Laptops & Computers', icon: '💻', link: '/category/laptops' },
    { name: 'Cameras', icon: '📷', link: '/category/cameras' },
    { name: 'Smartphones', icon: '📱', link: '/category/smartphones' },
    { name: 'Gaming', icon: '🎮', link: '/category/gaming' },
    { name: 'TV & Audio', icon: '📺', link: '/category/tv-audio' },
    { name: 'Headphones', icon: '🎧', link: '/category/headphones' },
    { name: 'Drones', icon: '🚁', link: '/category/drones' },
    { name: 'Gadgets', icon: '⌚', link: '/category/gadgets' },
    { name: 'SuperDeals', icon: '🔥', link: '/category/super-deals', special: true }
  ];

  return (
    <nav className="bottom-bar">
      <div className="bottom-bar-container">
        <button 
          className="categories-toggle" 
          onClick={toggleCategories}
        >
          <span className="categories-icon">☰</span>
          <span>All Categories</span>
        </button>
        
        <ul className={`categories-list ${isCategoriesOpen ? 'active' : ''}`}>
          {categories.map((category, index) => (
            <li 
              key={index} 
              className={`category-item ${category.special ? 'super-deals' : ''}`}
            >
              <a href={category.link} className="category-link">
                <span className="category-icon">{category.icon}</span>
                <span>{category.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default BottomBar;
