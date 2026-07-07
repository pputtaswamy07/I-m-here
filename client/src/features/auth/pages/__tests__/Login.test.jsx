import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Login from '../Login'

// ── Mocks ─────────────────────────────────────────────────────
const mockNavigate = vi.fn()
const mockMutate   = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => mockNavigate }
})

// Mock useMutation so we control the resolution without a real Apollo provider
vi.mock('@apollo/client/react', () => ({
  useMutation: () => [mockMutate, { loading: false }],
}))

// ── Helpers ───────────────────────────────────────────────────
const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )

// ── Tests ─────────────────────────────────────────────────────
describe('Login page', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    mockMutate.mockClear()
    localStorage.clear()
  })

  it('renders email and password inputs', () => {
    renderLogin()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('renders a login submit button', () => {
    renderLogin()
    expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument()
  })

  it('renders a link to the join page', () => {
    renderLogin()
    expect(screen.getByRole('link', { name: /join the community/i })).toBeInTheDocument()
  })

  it('shows "Welcome back" heading in the form panel', () => {
    renderLogin()
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
  })

  it('stores token and navigates to /dashboard on success', async () => {
    mockMutate.mockResolvedValue({ data: { login: 'mock-jwt-token' } })

    renderLogin()

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@test.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /^login$/i }))

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('mock-jwt-token')
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('displays an error message when login fails', async () => {
    mockMutate.mockRejectedValue(new Error('User not found'))

    renderLogin()

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'bad@test.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrong' },
    })
    fireEvent.click(screen.getByRole('button', { name: /^login$/i }))

    await waitFor(() => {
      expect(screen.getByText(/user not found/i)).toBeInTheDocument()
    })
  })

  it('shows "Signing in..." while the mutation is pending', async () => {
    // Never resolves during this test — keeps the button in loading state
    mockMutate.mockImplementation(() => new Promise(() => {}))

    renderLogin()

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@test.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /^login$/i }))

    expect(await screen.findByText(/signing in/i)).toBeInTheDocument()
  })
})
