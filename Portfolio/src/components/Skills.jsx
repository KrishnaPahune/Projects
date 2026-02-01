import React from 'react'
import './Skills.css'
function Skills() {
  const skillCategories = [
    {
      title: 'Frontend',
      skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Bootstrap'],
    },
    {
      title: 'Programming Language',
      skills: ['Python','JavaScript'],
    },
    {
      title: 'Tools & Technologies',
      skills: ['Git', 'GitHub', 'Figma'],
    },
    {
      title: 'Development Practices',
      skills: ['Agile Scrum','Version Control'],
    },
    {
      title: 'Soft Skills',
      skills: ['Communication', 'Problem Solving', 'Team Collaboration'],
    },
  ];
  return (
    <section id="skills" className="skills">
      <div className="skills-container">
        <h2 className="skills-title">Skills</h2>
        <div className="skills-grid">
          {skillCategories.map((category) => (
            <div key={category.title} className="skill-category">
              <h3 className="skill-category-title">
                {category.title}
              </h3>
              <ul className="skill-list">
                {category.skills.map((skill) => (
                  <li key={skill} className="skill-item">
                    <span className="skill-bullet">•</span>
                    {skill}
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

export default Skills
