import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Target, Zap, Users, TrendingUp } from 'lucide-react'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const values = [
    {
      icon: Target,
      title: 'Cloud-Native',
      description:
        'Building quality into AWS, Kubernetes, and containerized environments',
    },
    {
      icon: Zap,
      title: 'DevOps Integration',
      description:
        'Embedding testing into CI/CD pipelines for continuous quality assurance',
    },
    {
      icon: Users,
      title: 'Infrastructure as Code',
      description:
        'Automating test infrastructure with Terraform and Docker for consistency',
    },
    {
      icon: TrendingUp,
      title: 'Scalable Solutions',
      description:
        'Designing test frameworks that scale with cloud infrastructure growth',
    },
  ]

  return (
    <section id="about" className="py-12 px-6">
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
            About <span className="text-gradient">Me</span>
          </motion.h2>
          <motion.p
            className="text-center text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto text-sm px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            Senior Quality Engineer with deep expertise in cloud-native
            environments. AWS Certified with specialized knowledge in
            Kubernetes, Docker, and Infrastructure as Code. Architected CI/CD
            pipelines reducing deployment time by 60%, implemented SLO-based
            testing strategies, and embedded observability into test frameworks.
            Migrated test frameworks (Cypress → Playwright) and built GitOps
            workflows for zero-downtime deployments. Where quality engineering
            meets Site Reliability Engineering. ☁️🚀
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow p-4 h-full flex flex-col"
              >
                <div className="w-10 h-10 rounded-lg bg-pass/10 flex items-center justify-center mb-2 flex-shrink-0">
                  <value.icon className="text-pass" size={20} />
                </div>
                <h3 className="text-sm font-bold mb-1">{value.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
                  {value.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto">
            <h3 className="text-sm font-bold mb-2">
              Quality Engineering Philosophy
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Modern quality engineering is about building reliability into
              systems from day one. I practice shift-left testing, SLO/SLA
              validation, and treat test infrastructure as code. From contract
              testing in microservices to GitOps workflows with ArgoCD, from
              observability dashboards (Prometheus/Grafana) to chaos engineering
              in Kubernetes—I ensure quality scales with your infrastructure.
              AWS Certified and continuously expanding expertise in SRE
              practices, platform reliability, canary deployments, and
              cloud-native testing patterns.
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mt-3">
              Beyond technical execution, I've mentored 5+ junior QA engineers
              and led cross-functional quality initiatives across multiple
              teams. I believe in knowledge sharing and building quality-focused
              engineering cultures. In cloud-native systems, quality isn't a
              phase—it's a practice. ☁️✨
            </p>
          </div>

          <div className="mt-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 max-w-4xl mx-auto">
              <h3 className="text-sm font-bold mb-2">
                Education & Certifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600 dark:text-gray-400">
                {[
                  {
                    title: 'AWS Certified Cloud Practitioner',
                    desc: 'Cloud architecture and services expertise',
                  },
                  {
                    title: 'AWS Solutions Architect Associate',
                    desc: 'In Progress - Advanced cloud solution design',
                  },
                  {
                    title: 'ISTQB® Certified Tester',
                    desc: 'Foundation Level - Software testing principles',
                  },
                  {
                    title: 'University of Oxford',
                    desc: 'IT Systems Analysis and Design',
                  },
                ].map((cert) => (
                  <div
                    key={cert.title}
                    className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700"
                  >
                    <div className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      {cert.title}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {cert.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
