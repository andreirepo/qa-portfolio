import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Mail, Linkedin, Github } from 'lucide-react'

const Contact = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const contacts = [
    {
      icon: Mail,
      label: 'Email',
      value: 'andrei.repo@outlook.com',
      href: 'mailto:andrei.repo@outlook.com',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'linkedin.com/in/andrei-repo',
      href: 'https://linkedin.com/in/andrei-repo',
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'github.com/andreirepo',
      href: 'https://github.com/andreirepo',
    },
  ]

  return (
    <section id="contact" className="py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">
            Get in <span className="text-gradient">Touch</span>
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto text-sm px-4">
            Looking for a quality engineer who understands cloud infrastructure, can architect 
            scalable test systems, and speaks both QA and DevOps? AWS Certified with proven results: 
            60% faster deployments, 30% reduced test execution, zero-downtime releases through GitOps. ☁️
          </p>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
            {contacts.map((contact) => (
              <a
                key={contact.label}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group h-full min-h-[100px]"
              >
                <div className="w-10 h-10 bg-pass/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <contact.icon className="text-pass" size={20} />
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {contact.label}
                  </div>
                  <div className="text-xs font-medium break-all">{contact.value}</div>
                </div>
              </a>
            ))}
          </div>

          {/* CTA Box */}
          <div className="p-6 bg-gradient-to-br from-pass/5 to-emerald-50 dark:from-pass/10 dark:to-gray-800 rounded-lg border border-pass/20 dark:border-pass/30 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-pass/10 dark:bg-pass/20 rounded-full mb-3">
              <span className="w-2 h-2 bg-pass rounded-full animate-pulse"></span>
              <span className="text-xs font-semibold text-pass">Open to Opportunities</span>
            </div>
            <h3 className="text-lg font-bold mb-2">
              Ready to Elevate Your Quality Engineering
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 leading-relaxed max-w-3xl mx-auto">
              Seeking Senior QA Engineer, Staff QA Engineer, or Platform Reliability Engineer roles. 
              Specializing in cloud-native testing (AWS, Kubernetes), test automation at scale, 
              and building quality into CI/CD pipelines.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="mailto:andrei.repo@outlook.com"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-pass text-white rounded-lg text-sm font-semibold hover:bg-pass/90 transition-colors shadow-sm"
              >
                Let's Talk
              </a>
              <a
                href="/Andrei_Repo_Resume.pdf"
                download
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Download Resume
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
