import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Navbar from '../Navbar'

// ── Mocks ─────────────────────────────────────────────────────
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => mockNavigate }
})

// Stub ProfileMenu — it owns its own Apollo + router wiring which we test separately
vi.mock('../../../../shared/components/ProfileMenu', () => ({
  default: () => <div data-testid="profile-menu" />,
}))

// ── Helpers ───────────────────────────────────────────────────
const renderNavbar = (authenticated = false) => {
  if (authenticated) localStorage.setItem('token', 'test-token')
  else localStorage.removeItem('token')

  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  )
}

// ── Tests ─────────────────────────────────────────────────────
describe('Navbar', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    localStorage.clear()
  })

  it('shows About, contact and Join links when logged out', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /join/i })).toBeInTheDocument()
  })

  it('hides nav links when logged in', () => {
    renderNavbar(true)
    expect(screen.queryByRole('link', { name: /join/i })).not.toBeInTheDocument()
  })

  it('renders ProfileMenu when logged in', () => {
    renderNavbar(true)
    expect(screen.getByTestId('profile-menu')).toBeInTheDocument()
  })

  it('navigates to / when brand is clicked', () => {
    renderNavbar()
    fireEvent.click(screen.getByText(/i'm here/i))
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('Join link href is /join', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: /join/i })).toHaveAttribute('href', '/join')
  })
})
