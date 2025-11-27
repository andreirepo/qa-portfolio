import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Projects from '../../components/Projects'

describe('Projects', () => {
  it('renders project section title', () => {
    render(<Projects />)
    expect(screen.getByText(/Featured/i)).toBeInTheDocument()
  })

  it('displays projects from JSON data', () => {
    render(<Projects />)
    expect(screen.getByText(/E-Commerce Test Automation Suite/i)).toBeInTheDocument()
    expect(screen.getByText(/API Testing Framework/i)).toBeInTheDocument()
  })

  it('shows testing type badges', () => {
    render(<Projects />)
    expect(screen.getByText(/Automation/i)).toBeInTheDocument()
    expect(screen.getByText(/API/i)).toBeInTheDocument()
  })
})
