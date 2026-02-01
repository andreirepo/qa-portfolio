import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, Github, ExternalLink } from 'lucide-react'

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

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  if (!project) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-1">{project.title}</h2>
              <p className="text-gray-500 dark:text-gray-400">
                {project.company}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            <p className="text-lg mb-6">{project.fullDescription}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                <div className="text-3xl font-bold text-pass">
                  {project.metrics.testCases}
                </div>
                <div className="text-sm text-gray-500 mt-1">Test Cases</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                <div className="text-3xl font-bold text-pass">
                  {project.metrics.coverage}%
                </div>
                <div className="text-sm text-gray-500 mt-1">Coverage</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                <div className="text-3xl font-bold text-pass">
                  {project.metrics.bugsFound}
                </div>
                <div className="text-sm text-gray-500 mt-1">Bugs Found</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                <div className="text-3xl font-bold text-pass">
                  {project.metrics.timeReduction}%
                </div>
                <div className="text-sm text-gray-500 mt-1">Time Saved</div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Key Achievements</h3>
              <ul className="space-y-2">
                {project.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2
                      className="text-pass flex-shrink-0 mt-1"
                      size={20}
                    />
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              {project.links.github !== '#' && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-pass text-white rounded-lg hover:bg-pass/90 transition-colors"
                >
                  <Github size={20} />
                  View Code
                </a>
              )}
              {project.links.report !== '#' && (
                <a
                  href={project.links.report}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-pass transition-colors"
                >
                  <ExternalLink size={20} />
                  View Report
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ProjectModal
