import { getUserFromToken } from '../middleware/auth.js'
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'test-secret'

beforeEach(() => {
  process.env.JWT_SECRET = JWT_SECRET
})

describe('getUserFromToken', () => {
  it('returns null when Authorization header is missing', () => {
    const req = { headers: {} }
    expect(getUserFromToken(req)).toBeNull()
  })

  it('returns null when Authorization header is empty string', () => {
    const req = { headers: { authorization: '' } }
    expect(getUserFromToken(req)).toBeNull()
  })

  it('returns null when token is invalid', () => {
    const req = { headers: { authorization: 'Bearer invalid.token.here' } }
    expect(getUserFromToken(req)).toBeNull()
  })

  it('returns null when token is expired', () => {
    const expired = jwt.sign({ id: '123' }, JWT_SECRET, { expiresIn: -1 })
    const req = { headers: { authorization: `Bearer ${expired}` } }
    expect(getUserFromToken(req)).toBeNull()
  })

  it('returns decoded payload for a valid token', () => {
    const token = jwt.sign({ id: 'user-abc' }, JWT_SECRET, { expiresIn: '1h' })
    const req = { headers: { authorization: `Bearer ${token}` } }
    const result = getUserFromToken(req)
    expect(result).toMatchObject({ id: 'user-abc' })
  })

  it('returns null when signed with a different secret', () => {
    const token = jwt.sign({ id: 'user-abc' }, 'wrong-secret')
    const req = { headers: { authorization: `Bearer ${token}` } }
    expect(getUserFromToken(req)).toBeNull()
  })
})
