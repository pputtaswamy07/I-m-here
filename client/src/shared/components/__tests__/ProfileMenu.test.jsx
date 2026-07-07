import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import ProfileMenu from '../ProfileMenu'

// ── Mocks ─────────────────────────────────────────────────────
const mockNavigate   = vi.fn()
const mockClearStore = vi.fn().mockResolvedValue(undefined)

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('@apollo/client/react', () => ({
  useApolloClient: () => ({ clearStore: mockClearStore }),
}))

// ── Helpers ───────────────────────────────────────────────────
const renderMenu = (showDashboard = false) =>
  render(
    <MemoryRouter>
      <ProfileMenu showDashboard={showDashboard} />
    </MemoryRouter>
  )

// ── Tests ─────────────────────────────────────────────────────
describe('ProfileMenu', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    mockClearStore.mockClear()
    localStorage.clear()
  })

  it('renders the avatar trigger button', () => {
    renderMenu()
    expect(screen.getByRole('button', { name: /open profile menu/i })).toBeInTheDocument()
  })

  it('dropdown is hidden by default', () => {
    renderMenu()
    expect(screen.queryByText(/^requests$/i)).not.toBeInTheDocument()
  })

  it('opens the dropdown when avatar is clicked', () => {
    renderMenu()
    fireEvent.click(screen.getByRole('button', { name: /open profile menu/i }))
    expect(screen.getByText(/^requests$/i)).toBeInTheDocument()
    expect(screen.getByText(/my activities/i)).toBeInTheDocument()
    expect(screen.getByText(/^settings$/i)).toBeInTheDocument()
    expect(screen.getByText(/^contact$/i)).toBeInTheDocument()
    expect(screen.getByText(/^logout$/i)).toBeInTheDocument()
  })

  it('shows a Dashboard item when showDashboard is true', () => {
    renderMenu(true)
    fireEvent.click(screen.getByRole('button', { name: /open profile menu/i }))
    expect(screen.getByText(/^dashboard$/i)).toBeInTheDocument()
  })

  it('does not show Dashboard item when showDashboard is false', () => {
    renderMenu(false)
    fireEvent.click(screen.getByRole('button', { name: /open profile menu/i }))
    expect(screen.queryByText(/^dashboard$/i)).not.toBeInTheDocument()
  })

  it('navigates to /my-requests when Requests is clicked', () => {
    renderMenu()
    fireEvent.click(screen.getByRole('button', { name: /open profile menu/i }))
    fireEvent.click(screen.getByText(/^requests$/i))
    expect(mockNavigate).toHaveBeenCalledWith('/my-requests')
  })

  it('navigates to /settings when Settings is clicked', () => {
    renderMenu()
    fireEvent.click(screen.getByRole('button', { name: /open profile menu/i }))
    fireEvent.click(screen.getByText(/^settings$/i))
    expect(mockNavigate).toHaveBeenCalledWith('/settings')
  })

  it('clears Apollo store, wipes localStorage, and navigates to /login on logout', async () => {
    localStorage.setItem('token', 'test-token')
    renderMenu()
    fireEvent.click(screen.getByRole('button', { name: /open profile menu/i }))
    fireEvent.click(screen.getByText(/^logout$/i))

    await waitFor(() => {
      expect(mockClearStore).toHaveBeenCalled()
      expect(localStorage.getItem('token')).toBeNull()
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })

  it('closes the dropdown on outside click', async () => {
    renderMenu()
    fireEvent.click(screen.getByRole('button', { name: /open profile menu/i }))
    expect(screen.getByText(/^requests$/i)).toBeInTheDocument()

    fireEvent.mouseDown(document.body)
    await waitFor(() => {
      expect(screen.queryByText(/^requests$/i)).not.toBeInTheDocument()
    })
  })
})
