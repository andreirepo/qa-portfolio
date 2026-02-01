import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    // Just check that the app renders without throwing - use getAllByText since name appears multiple times
    expect(screen.getAllByText(/Andrei Repo/i).length).toBeGreaterThan(0)
  })

  it('displays the hero section', () => {
    render(<App />)
    expect(screen.getByText(/All Tests Passing/i)).toBeInTheDocument()
  })

  it('has navigation header', () => {
    render(<App />)
    expect(screen.getByText(/Cloud QA/i)).toBeInTheDocument()
  })
})
