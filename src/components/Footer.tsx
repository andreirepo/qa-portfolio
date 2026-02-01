import { CheckCircle2 } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="py-8 px-6 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-pass" size={18} />
            <span className="font-mono text-sm font-semibold text-pass">
              All Tests Passing
            </span>
          </div>
          <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Andrei Repo • Cloud Quality Engineer
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Built with React & TypeScript
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
