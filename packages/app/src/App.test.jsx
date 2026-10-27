import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App.jsx'

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders the heading using the shared capitalize helper', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Vite + React')
  })

  it('increments the count and persists it to localStorage', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'count is 0' }))

    expect(screen.getByRole('button', { name: 'count is 1' })).toBeInTheDocument()
    expect(window.localStorage.getItem('count')).toBe('1')
  })

  it('restores the count from localStorage', () => {
    window.localStorage.setItem('count', '5')
    render(<App />)

    expect(screen.getByRole('button', { name: 'count is 5' })).toBeInTheDocument()
  })
})
