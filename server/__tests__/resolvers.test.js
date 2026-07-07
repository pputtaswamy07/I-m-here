import resolvers from '../schema/resolvers.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// ── Mock mongoose models so no real DB is needed ────────────
jest.mock('../models/Users.js', () => ({
  default: {
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  },
}))

jest.mock('../models/Availability.js', () => ({
  default: {
    find: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
  },
}))

import User from '../models/Users.js'
import Availability from '../models/Availability.js'

const JWT_SECRET = 'test-secret'
beforeAll(() => { process.env.JWT_SECRET = JWT_SECRET })
beforeEach(() => { jest.clearAllMocks() })

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
