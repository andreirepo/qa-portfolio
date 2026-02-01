import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Header from '../../components/Header'

describe('Header', () => {
  it('renders navigation items', () => {
    const setDarkMode = vi.fn()
    render(
      <BrowserRouter>
        <Header darkMode={false} setDarkMode={setDarkMode} />
      </BrowserRouter>
    )

    expect(screen.getByText(/about/i)).toBeInTheDocument()
    expect(screen.getAllByText(/projects/i)).toHaveLength(2) // Desktop and mobile versions
    expect(screen.getByText(/skills/i)).toBeInTheDocument()
    expect(screen.getAllByText(/contact/i)).toHaveLength(2) // Desktop and mobile versions
  })

  it('toggles dark mode when button is clicked', () => {
    const setDarkMode = vi.fn()
    render(
      <BrowserRouter>
        <Header darkMode={false} setDarkMode={setDarkMode} />
      </BrowserRouter>
    )

    const darkModeButtons = screen.getAllByLabelText(/toggle dark mode/i)
    fireEvent.click(darkModeButtons[0])

    expect(setDarkMode).toHaveBeenCalledWith(true)
  })
})
