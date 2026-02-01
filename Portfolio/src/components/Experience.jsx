import React from 'react'
import './Experience.css'
function Experience() {
     const experiences = [
    {
      role: 'Frontend Development Intern',
      company: 'EISystems Technologies Pvt. Ltd.',
      duration: 'Sep 2024 – Oct 2024',
      description: [
        'Developed responsive web interfaces using HTML, CSS, JavaScript, Bootstrap, and React.js, focusing on reusable components and clean UI structure.',
      ],
    },
    {
      role: 'Python Developer Intern',
      company: 'Sumago Infotech Pvt. Ltd.',
      duration: 'Dec 2024 – Jan 2025',
      description: [
        'Worked on core Python programming along with data processing and analysis using Pandas; collaborated on dashboards and reports using Power BI.',
        'Recognized as Top Performer for strong technical learning and execution.',
      ],
    },
  ];
  return (
     <section id="experience" className="experience">
      <div className="experience-container">
        <h2 className="experience-title">Experience</h2>
        <div className="experience-list">
          {experiences.map((exp, index) => (
            <div key={index} className="experience-item">
              <div className="experience-header">
                <h3 className="experience-role">{exp.role}</h3>
                <p className="experience-company">{exp.company}</p>
              </div>
              <p className="experience-duration">{exp.duration}</p>
              <ul className="experience-description">
                {exp.description.map((item, idx) => (
                  <li key={idx} className="experience-description-item">
                    <span className="experience-bullet">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience
