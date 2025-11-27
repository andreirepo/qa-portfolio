import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { TrendingUp, DollarSign, Zap, CheckCircle, Users, Bug } from 'lucide-react'

const ImpactMetrics = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const metrics = [
    {
      value: '500+',
      label: 'Tests Automated',
      icon: Zap,
      description: 'Across 7 major projects',
      color: 'text-blue-500'
    },
    {
      value: '$200K+',
      label: 'Cost Savings',
      icon: DollarSign,
      description: 'Through automation efficiency',
      color: 'text-green-500'
    },
    {
      value: '60%',
      label: 'Faster Deployments',
      icon: TrendingUp,
      description: 'Reduced release cycle time',
      color: 'text-purple-500'
    },
    {
      value: '0',
      label: 'Production Incidents',
      icon: CheckCircle,
      description: 'In last 24 months',
      color: 'text-pass'
    },
    {
      value: '5+',
      label: 'Engineers Mentored',
      icon: Users,
      description: 'Junior to mid-level QA',
      color: 'text-orange-500'
    },
    {
      value: '200+',
      label: 'Bugs Prevented',
      icon: Bug,
      description: 'Caught before production',
      color: 'text-red-500'
    }
  ]

  return (
    <section className="py-12 px-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
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
            Measurable <span className="text-gradient">Impact</span>
          </motion.h2>
          <motion.p
            className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            Real results from quality engineering initiatives
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow h-full"
              >
                <div className="flex items-start gap-3 h-full">
                  <div className={`w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 ${metric.color}`}>
                    <metric.icon size={20} />
                  </div>
                  <div className="flex-1 min-h-0">
                    <div className="text-2xl font-bold mb-1 text-gray-800 dark:text-gray-200">
                      {metric.value}
                    </div>
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      {metric.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {metric.description}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Context */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8 }}
            className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto"
          >
            <h3 className="text-lg font-bold mb-3 text-center">
              How These Numbers Were Achieved
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">Automation:</span> Implemented comprehensive test suites using Playwright, Cypress, and k6 across multiple projects
              </div>
              <div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">Cost Savings:</span> Reduced manual testing hours, prevented production incidents, and accelerated release cycles
              </div>
              <div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">Speed:</span> Optimized CI/CD pipelines with parallel execution and strategic test selection
              </div>
              <div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">Quality:</span> Shift-left testing, comprehensive coverage, and proactive monitoring strategies
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default ImpactMetrics
