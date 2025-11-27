import { Moon, Sun, Menu, X, Download } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
}

const Header = ({ darkMode, setDarkMode }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  const navItems = ['about', 'projects', 'skills', 'contact']

  return (
    <header className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl z-50 border-b border-gray-200 dark:border-gray-800">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Clickable */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">Andrei Repo</span>
            <span className="hidden sm:inline text-gray-400 dark:text-gray-600">•</span>
            <span className="hidden sm:inline text-xs text-gray-600 dark:text-gray-400">Cloud QA</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="capitalize hover:text-pass transition-colors relative group text-sm font-medium"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pass group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
            
            {/* Resume Download Button */}
            <a
              href="/Andrei_Repo_Resume.pdf"
              download
              className="px-4 py-2 rounded-lg bg-pass text-white hover:bg-pass/90 transition-colors inline-flex items-center gap-2 text-sm font-medium"
            >
              <Download size={16} />
              <span>Resume</span>
            </a>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            <a
              href="/Andrei_Repo_Resume.pdf"
              download
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Download Resume"
            >
              <Download size={16} />
            </a>
            <button
              onClick={() => scrollToSection('projects')}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-pass transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-3 py-1.5 rounded-lg bg-pass text-white hover:bg-pass/90 transition-colors text-xs font-medium"
            >
              Contact
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left py-3 px-4 hover:text-pass transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('skills')}
              className="block w-full text-left py-3 px-4 hover:text-pass transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium"
            >
              Skills
            </button>
            <button
              onClick={() => {
                setDarkMode(!darkMode)
                setMobileMenuOpen(false)
              }}
              className="flex items-center gap-3 w-full text-left py-3 px-4 hover:text-pass transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
