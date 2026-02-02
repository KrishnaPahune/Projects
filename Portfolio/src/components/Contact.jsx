import { Mail, Linkedin, Github } from "lucide-react";
import { useState } from "react";
import "./Contact.css";
function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const handleSubmit = (e) => {
  e.preventDefault();

  const { name, email, message } = formData;

  const mailtoLink = `mailto:krishnapahune4@gmail.com
    ?subject=${encodeURIComponent(`Portfolio Contact from ${name}`)}
    &body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;

  window.location.href = mailtoLink;
};


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <section id="contact" className="contact">
      <div className="contact-container">
        <h2 className="contact-title">Contact</h2>
        <div className="contact-grid">
          <div className="contact-info">
            <p className="contact-intro">
              Feel free to reach out for opportunities, collaborations, or just
              to connect!
            </p>
            <div className="contact-links">
              <a
                href="mailto:krishnapahune4@gmail.com"
                className="contact-link"
              >
                <Mail size={20} />
                krishnapahune4@gmail.com
              </a>
              <a
                href="https://www.linkedin.com/in/krishna-pahune"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                <Linkedin size={20} />
                linkedin.com/in/krishna-pahune
              </a>
              <a
                href="https://github.com/KrishnaPahune"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                <Github size={20} />
                github.com/KrishnaPahune
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="message" className="form-label">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="form-textarea"
              />
            </div>
            <button type="submit" className="form-button">
  Send Message
</button>

          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
