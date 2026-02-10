import React from 'react';
import './BottomBar.css';

const BottomBar = () => {
  const categories = [
    { name: 'Smart TVs', icon: '😎', link: '/category/smart-tvs' },
    { name: 'Refrigerators', icon: '🧊', link: '/category/refrigerators' },
    { name: 'Washing Machines', icon: '🧺', link: '/category/washing-machines' },
    { name: 'Air Conditioners', icon: '❄️', link: '/category/air-conditioners' },
    { name: 'Kitchen Appliances', icon: '♨️', link: '/category/kitchen-appliances' },
    { name: 'Home Appliances', icon: '🏠', link: '/category/home-appliances' },
    { name: 'Light Fittings', icon: '🔌', link: '/brands' },
    { name: 'SuperDeals', icon: '🔥', link: '/category/super-deals', special: true }
  ];

  return (
    <nav className="bottom-bar">
      <div className="bottom-bar-container">
        <ul className="categories-list">
          {categories.map((category) => (
            <li
              key={category.name}
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
