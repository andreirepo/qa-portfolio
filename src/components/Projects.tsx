import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ExternalLink, Github } from 'lucide-react'
import projectsData from '../data/projects.json'
import ProjectModal from './ProjectModal'

interface Project {
  id: string
  title: string
  company: string
  description: string
  fullDescription: string
  testingTypes: string[]
  technologies: string[]
  achievements: string[]
  metrics: {
    testCases: number
    coverage: number
    bugsFound: number
    timeReduction: number
  }
  links: {
    github: string
    report: string
  }
}

const Projects = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <section id="projects" className="py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-3 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
          >
            Featured <span className="text-gradient">Projects</span>
          </motion.h2>
          <motion.p
            className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            Cloud-native testing projects showcasing modern QA and DevOps
            practices
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {(projectsData as Project[]).map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer group p-5"
                onClick={() => setSelectedProject(project)}
              >
                {/* Title & Company */}
                <div className="mb-3">
                  <h3 className="text-base font-bold mb-1 group-hover:text-pass transition-colors line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {project.company}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Testing Types */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.testingTypes.slice(0, 3).map((type) => (
                    <span
                      key={type}
                      className="px-2 py-0.5 bg-gray-100/80 dark:bg-gray-700/50 rounded text-xs font-medium"
                    >
                      {type}
                    </span>
                  ))}
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 bg-gray-50 dark:bg-gray-700/30 rounded text-xs font-mono text-gray-600 dark:text-gray-400"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="px-2 py-0.5 bg-gray-50 dark:bg-gray-700/30 rounded text-xs text-gray-500">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>

                {/* Metrics & Links */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex gap-3 text-xs">
                    <div>
                      <span className="font-bold text-pass">
                        {project.metrics.testCases}
                      </span>
                      <span className="text-gray-500 ml-1">tests</span>
                    </div>
                    <div>
                      <span className="font-bold text-pass">
                        {project.metrics.coverage}%
                      </span>
                      <span className="text-gray-500 ml-1">coverage</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {project.links.github !== '#' && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                        title="View Code"
                      >
                        <Github
                          size={16}
                          className="text-gray-600 dark:text-gray-400"
                        />
                      </a>
                    )}
                    {project.links.report !== '#' && (
                      <a
                        href={project.links.report}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                        title="View Docs"
                      >
                        <ExternalLink
                          size={16}
                          className="text-gray-600 dark:text-gray-400"
                        />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  )
}

export default Projects
