import React from 'react'
import { ExternalLink, Github } from 'lucide-react';
import './Projects.css'
function Projects() {
  const projects = [
    {
      title: 'Portfolio Website',
      description: 'A personal portfolio website to showcase my projects and skills.',
      techStack: ['React', 'CSS', 'HTML', 'JavaScript'],
      githubUrl: 'https://github.com/KrishnaPahune/Projects/tree/2a6eec9a1013a32b529d3959799b6153dc0a20ba/Portfolio',
      liveUrl: 'https://krishnapahune.vercel.app',
    },
    {
      title: 'Google Keep Clone',
      description: 'User can view, add, update and delete notes.',
      techStack: ['React', 'JavaScript', 'HTML', 'CSS'],
      githubUrl: 'https://github.com/KrishnaPahune/Projects/tree/f4153067fe2c6d05e2940d727a8c3a328718e96f/google-keep-clone',
      liveUrl: 'https://google-keep-clone-tau.vercel.app/',
    },
    {
      title: 'ShopEasy',
      description: 'Developed a React-based e-commerce website with add-to-cart functionality and real-time cart count updates using state management.',
      techStack: ['React', 'JavaScript', 'HTML', 'CSS'],
      githubUrl: 'https://github.com/KrishnaPahune/Projects/tree/f4153067fe2c6d05e2940d727a8c3a328718e96f/ShopEasy',
      liveUrl: 'https://shopeasy-sand.vercel.app/',
    },
    {
      title: 'Expresso',
      description: 'Packers and Movers Website with responsive design and user-friendly interface.',
      techStack: ['JavaScript', 'HTML', 'CSS'],
      githubUrl: 'https://github.com/KrishnaPahune/Projects/tree/f4153067fe2c6d05e2940d727a8c3a328718e96f/Expresso',
      liveUrl: 'https://expresso-sage.vercel.app/',
    },
    {
      title: 'Alphabet Game',
      description: 'An interactive game for children to learn the alphabet with visual and audio feedback.',
      techStack: ['JavaScript', 'HTML', 'CSS'],
      githubUrl: 'https://github.com/KrishnaPahune/Projects/tree/f4153067fe2c6d05e2940d727a8c3a328718e96f/Alphabets%20Game',
      liveUrl: 'https://alphabet-game-opal.vercel.app/',
    },
    {
      title: 'Random Password Generator',
      description: 'A web application that generates secure random passwords.',
      techStack: ['JavaScript', 'HTML', 'CSS'],
      githubUrl: 'https://github.com/KrishnaPahune/Projects/tree/f4153067fe2c6d05e2940d727a8c3a328718e96f/Random%20password%20generater',
      liveUrl: 'https://password-generator-gray-sigma.vercel.app/',
    },
    {
      title: 'Role The Dice Game',
      description: 'A simple dice rolling game built with React and JavaScript.',
      techStack: ['JavaScript', 'HTML', 'CSS'],
      githubUrl: 'https://github.com/KrishnaPahune/Projects/tree/4730ac37d5cd82c9e870990156370791a542fabb/RollIt',
      liveUrl: 'https://roll-the-dice-xi.vercel.app/',
    },
  ];
  return (
    <section id="projects" className="projects">
      <div className="projects-container">
        <h2 className="projects-title">Projects</h2>
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.title} className="project-card">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <div className="project-tech">
                {project.techStack.map((tech) => (
                  <span key={tech} className="project-tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="project-links">
                <a href={project.githubUrl} className="project-link">
                  <Github size={18} />
                  Code
                </a>
                <a href={project.liveUrl} className="project-link">
                  <ExternalLink size={18} />
                  Live Demo
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
