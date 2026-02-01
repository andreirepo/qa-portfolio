import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    // Just check that the app renders without throwing
    expect(screen.getByText(/Andrei Repo/i)).toBeInTheDocument()
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
