import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Quote, Linkedin, ChevronLeft, ChevronRight } from 'lucide-react'

interface Recommendation {
  name: string
  title: string
  company: string
  text: string
  photo?: string
  linkedinUrl?: string
  relationship: string // e.g., "Managed Andrei directly", "Worked with Andrei on the same team"
  date?: string // e.g., "November 2024"
}

const LinkedInRecommendations = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const recommendations: Recommendation[] = [
    {
      name: 'Tim Davies',
      title: 'Head of Web',
      company: 'Sketch',
      relationship: 'Managed Andrei directly',
      text: 'Andrei is a dedicated QA engineer who cares about doing things properly. He was key to fixing our CI/CD and E2E setup. The Cypress suite had grown messy and flaky over the years and he reorganised it from the core. He replaced brittle fixtures with ephemeral ones, cut flakiness and shifted the pipeline from scheduled monitoring to support real-time release deployments. He also set the groundwork for a move to Playwright, for which I am immensely grateful. He managed a wide range of Web team requests, including Stripe integration, SSO implementation, email validation and regular cross-browser runs. Beyond web, he jumped in where needed, assisting with Jenkins and running hands-on testing on our macOS and iOS platforms too. A truly versatile QA professional. Everyone I spoke with across the teams enjoyed working with Andrei because he\'s reliable, quick to help and doesn\'t shy away from taking ownership. He\'s a great QA engineer and I\'d happily work with him again on any project, of any size.',
      linkedinUrl: 'https://linkedin.com/in/timdavies',
      date: 'August 2025'
    },
    {
      name: 'Michal Cs',
      title: 'QA Engineer',
      company: 'Sketch',
      relationship: 'Worked with Andrei on the same team',
      text: 'Andrei is not just a successful QA engineer, but he is also incredibly product-minded, considering the end user\'s experience in all that he does. I was fortunate enough to work with Andrei on our web app team at Sketch, where Andrei led our QA efforts and also took the lead on automated QA efforts, managing our end-to-end suites. This work was vital in enabling our close-to-continuous release process, providing engineers with the confidence to ship quickly and users with the assurance that they\'d face minimal impact while the team worked at pace. Proactive, engaged, and ultimately a team player, Andrei ranks amongst some of the most professional and engaged QA engineers I\'ve worked with.',
      linkedinUrl: 'https://linkedin.com/in/michalcs',
      date: 'August 2025'
    }
  ]

  // Auto-play carousel
  useEffect(() => {
    if (isPaused || recommendations.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % recommendations.length)
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [isPaused, recommendations.length])

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % recommendations.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + recommendations.length) % recommendations.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <section id="recommendations" className="py-16 px-6 bg-gray-50 dark:bg-gray-900">
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
            LinkedIn <span className="text-gradient">Recommendations</span>
          </motion.h2>
          <motion.p
            className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            What colleagues and managers say about working with me
          </motion.p>

          {/* Carousel Container */}
          <div 
            className="relative max-w-4xl mx-auto mb-8"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Carousel Cards */}
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-pass/10 flex items-center justify-center text-pass font-bold text-base flex-shrink-0">
                      {recommendations[currentIndex].name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base text-gray-800 dark:text-gray-200">
                        {recommendations[currentIndex].name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {recommendations[currentIndex].title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-500">
                        {recommendations[currentIndex].company}
                      </div>
                    </div>
                    {recommendations[currentIndex].linkedinUrl && (
                      <a
                        href={recommendations[currentIndex].linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0A66C2] hover:text-[#004182] transition-colors flex-shrink-0"
                        title="View on LinkedIn"
                      >
                        <Linkedin size={20} />
                      </a>
                    )}
                  </div>

                  {/* Relationship */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic">
                    {recommendations[currentIndex].relationship}
                    {recommendations[currentIndex].date && ` • ${recommendations[currentIndex].date}`}
                  </div>

                  {/* Quote */}
                  <Quote className="text-pass/20 mb-2" size={24} />
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {recommendations[currentIndex].text}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            {recommendations.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-md"
                  aria-label="Previous recommendation"
                >
                  <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-md"
                  aria-label="Next recommendation"
                >
                  <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
              </>
            )}
          </div>

          {/* Navigation Dots */}
          {recommendations.length > 1 && (
            <div className="flex justify-center gap-2 mb-8">
              {recommendations.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-pass w-8'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                  aria-label={`Go to recommendation ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center">
            <a
              href="https://linkedin.com/in/andrei-repo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A66C2] text-white rounded-lg font-semibold hover:bg-[#004182] transition-colors"
            >
              <Linkedin size={20} />
              View All Recommendations on LinkedIn
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default LinkedInRecommendations
