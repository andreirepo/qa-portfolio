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
    // Check for first project title
    expect(
      screen.getByText(/E2E Automation with Playwright/i)
    ).toBeInTheDocument()
    // Check for project metrics (using getAllByText for multiple matches)
    expect(screen.getAllByText(/tests/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/coverage/i).length).toBeGreaterThan(0)
  })

  it('shows testing type badges', () => {
    render(<Projects />)
    // Check for common testing types (using getAllByText for multiple matches)
    expect(screen.getAllByText(/E2E/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/API/i).length).toBeGreaterThan(0)
  })
})
