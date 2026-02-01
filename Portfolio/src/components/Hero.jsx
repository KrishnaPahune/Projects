import './Hero.css';
import { FileDown, ArrowRight } from 'lucide-react';
function Hero() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  }
  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Krishna Gajanan Pahune
          </h1>
          <h2 className="hero-subtitle">
            React Frontend Developer
          </h2>
          <p className="hero-description">
            Passionate about building clean, user-friendly interfaces with strong fundamentals in JavaScript, React, and modern web technologies.
          </p>
          <div className="hero-buttons">
            <button
              onClick={() => scrollToSection('projects')}
              className="hero-button-primary"
            >
              View Projects
              <ArrowRight size={20} />
            </button>
            <a
              href="../public/resume.pdf"
              download
              className="hero-button-secondary"
            >
              <FileDown size={20} />
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Hero;
