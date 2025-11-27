import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Quote } from 'lucide-react'

interface Testimonial {
  name: string
  title: string
  company: string
  text: string
  photo?: string
  linkedin?: string
}

const Testimonials = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const testimonials: Testimonial[] = [
    {
      name: 'Your Manager Name',
      title: 'Engineering Manager',
      company: 'Sketch B.V.',
      text: "Andrei's migration of our test framework to Playwright was exceptional. His technical expertise and mentorship elevated our entire QA team's capabilities.",
      linkedin: '#'
    },
    {
      name: 'Your Colleague Name',
      title: 'Senior QA Engineer',
      company: 'Playtech plc',
      text: 'Working with Andrei on the Games Marketplace project was a game-changer. His automation strategies reduced our release cycle by 60% while improving quality.',
      linkedin: '#'
    },
    {
      name: 'Your Team Lead Name',
      title: 'Tech Lead',
      company: 'Previous Company',
      text: 'Andrei brings a unique blend of QA expertise and DevOps knowledge. His cloud-native testing approach helped us achieve zero production incidents for 2 years.',
      linkedin: '#'
    }
  ]

  return (
    <section id="testimonials" className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
          >
            What People <span className="text-gradient">Say</span>
          </motion.h2>
          <motion.p
            className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            Recommendations from colleagues and managers I've worked with
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <Quote className="text-pass mb-4" size={32} />
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-pass/10 flex items-center justify-center text-pass font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {testimonial.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {testimonial.company}
                    </div>
                  </div>
                </div>

                {testimonial.linkedin && testimonial.linkedin !== '#' && (
                  <a
                    href={testimonial.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-xs text-pass hover:underline inline-block"
                  >
                    View on LinkedIn →
                  </a>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Want to add your testimonial?{' '}
              <a
                href="#contact"
                className="text-pass hover:underline"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Get in touch
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
