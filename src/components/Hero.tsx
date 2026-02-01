const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 pb-8 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center">
          {/* Name & Title */}
          <div className="mb-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 tracking-tight text-gray-800 dark:text-gray-200">
              Andrei Repo
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-medium max-w-2xl mx-auto mb-2">
              Senior Quality Engineer | Cloud-Native Testing & DevOps
              Integration
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 max-w-2xl mx-auto mb-1">
              AWS Certified • Building Resilient QA Systems
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 max-w-2xl mx-auto">
              60% faster deployments • Zero production incidents • 500+ tests
              automated
            </p>
          </div>

          {/* Specializations */}
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Test Automation • CI/CD • Kubernetes • Infrastructure as Code •
            Observability
          </p>

          {/* Certification Badge */}
          <div className="flex justify-center mb-6">
            <img
              src="/badges/aws-certified-cloud-practitioner.png"
              alt="AWS Certified Cloud Practitioner"
              className="h-16 sm:h-20"
            />
          </div>

          {/* CTA Pill */}
          <button
            onClick={() =>
              document
                .getElementById('contact')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="inline-flex items-center gap-2 px-6 py-3 bg-pass text-white rounded-full font-medium hover:bg-pass/90 transition-all hover:scale-105 text-sm shadow-lg shadow-pass/25 hover:shadow-xl hover:shadow-pass/30 focus:outline-none focus:ring-2 focus:ring-pass/50 focus:ring-offset-2"
          >
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            <span>Let's build resilient quality systems together</span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero
