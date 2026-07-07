import resolvers from '../schema/resolvers.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// ── Mock mongoose models so no real DB is needed ────────────
// __esModule: true tells Babel's _interopRequireDefault to skip the
// double-wrapping it would otherwise apply to the default export.
jest.mock('../models/Users.js', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  },
}))

jest.mock('../models/Availability.js', () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    updateMany: jest.fn(),
  },
}))

import User from '../models/Users.js'
import Availability from '../models/Availability.js'

const JWT_SECRET = 'test-secret'
beforeAll(() => { process.env.JWT_SECRET = JWT_SECRET })
beforeEach(() => { jest.clearAllMocks() })

// ── Query: availabilities ────────────────────────────────────
describe('Query.availabilities', () => {
  it('returns active availabilities with user populated', async () => {
    const fakeList = [{ id: 'a1', isActive: true }]
    const populateMock = jest.fn().mockResolvedValue(fakeList)
    Availability.find.mockReturnValue({ populate: populateMock })

    const result = await resolvers.Query.availabilities()
    expect(Availability.find).toHaveBeenCalledWith({ isActive: true })
    expect(populateMock).toHaveBeenCalledWith('user')
    expect(result).toEqual(fakeList)
  })
})

// ── Query: me ────────────────────────────────────────────────
describe('Query.me', () => {
  it('returns null when no user in context', async () => {
    const result = await resolvers.Query.me(null, {}, { user: null })
    expect(result).toBeNull()
  })

  it('fetches user by id from context', async () => {
    const fakeUser = { id: 'u1', name: 'Alice', role: 'VOLUNTEER' }
    User.findById.mockResolvedValue(fakeUser)

    const result = await resolvers.Query.me(null, {}, { user: { id: 'u1' } })
    expect(User.findById).toHaveBeenCalledWith('u1')
    expect(result).toEqual(fakeUser)
  })
})

// ── Mutation: register ───────────────────────────────────────
describe('Mutation.register', () => {
  const args = {
    name: 'Bob',
    email: 'bob@example.com',
    password: 'secret123',
    phone: '+1 555 0000',
    location: 'Berlin',
    role: 'SEEKER',
  }

  it('throws if user already exists', async () => {
    User.findOne.mockResolvedValue({ email: args.email })

    await expect(
      resolvers.Mutation.register(null, args)
    ).rejects.toThrow('User already exists')
  })

  it('creates user and returns a JWT token', async () => {
    User.findOne.mockResolvedValue(null)
    User.create.mockResolvedValue({ _id: 'new-id', ...args })

    const token = await resolvers.Mutation.register(null, args)
    const decoded = jwt.verify(token, JWT_SECRET)
    expect(decoded).toMatchObject({ id: 'new-id' })
  })

  it('hashes the password before storing', async () => {
    User.findOne.mockResolvedValue(null)
    let storedPassword = null
    User.create.mockImplementation(async (data) => {
      storedPassword = data.password
      return { _id: 'x', ...data }
    })

    await resolvers.Mutation.register(null, args)
    expect(storedPassword).not.toBe(args.password)
    expect(await bcrypt.compare(args.password, storedPassword)).toBe(true)
  })
})

// ── Mutation: login ──────────────────────────────────────────
describe('Mutation.login', () => {
  it('throws when user is not found', async () => {
    User.findOne.mockResolvedValue(null)

    await expect(
      resolvers.Mutation.login(null, { email: 'no@one.com', password: 'x' })
    ).rejects.toThrow('User not found')
  })

  it('throws on invalid password', async () => {
    const hashed = await bcrypt.hash('correct', 10)
    User.findOne.mockResolvedValue({ _id: 'u1', password: hashed })

    await expect(
      resolvers.Mutation.login(null, { email: 'a@b.com', password: 'wrong' })
    ).rejects.toThrow('Invalid password')
  })

  it('returns a valid JWT token on correct credentials', async () => {
    const hashed = await bcrypt.hash('right', 10)
    User.findOne.mockResolvedValue({ _id: 'u2', password: hashed })

    const token = await resolvers.Mutation.login(null, { email: 'a@b.com', password: 'right' })
    const decoded = jwt.verify(token, JWT_SECRET)
    expect(decoded).toMatchObject({ id: 'u2' })
  })
})

// ── Mutation: markAvailable ──────────────────────────────────
describe('Mutation.markAvailable', () => {
  it('throws when not authenticated', async () => {
    await expect(
      resolvers.Mutation.markAvailable(null, { tasks: [], location: 'Berlin' }, { user: null })
    ).rejects.toThrow('Not authenticated')
  })

  it('creates an availability record for the logged-in user', async () => {
    const fakeAvail = { id: 'av1', user: 'u1', tasks: ['errands'], location: 'Berlin' }
    Availability.create.mockResolvedValue(fakeAvail)

    const result = await resolvers.Mutation.markAvailable(
      null,
      { tasks: ['errands'], location: 'Berlin' },
      { user: { id: 'u1' } }
    )
    expect(Availability.create).toHaveBeenCalledWith({ user: 'u1', tasks: ['errands'], location: 'Berlin' })
    expect(result).toEqual(fakeAvail)
  })
})

// ── Mutation: markUnavailable ────────────────────────────────
describe('Mutation.markUnavailable', () => {
  it('throws when not authenticated', async () => {
    await expect(
      resolvers.Mutation.markUnavailable(null, {}, { user: null })
    ).rejects.toThrow('Not authenticated')
  })

  it('marks all user availabilities inactive and returns true', async () => {
    Availability.updateMany.mockResolvedValue({})

    const result = await resolvers.Mutation.markUnavailable(null, {}, { user: { id: 'u1' } })
    expect(Availability.updateMany).toHaveBeenCalledWith({ user: 'u1' }, { isActive: false })
    expect(result).toBe(true)
  })
})
