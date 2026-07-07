describe('Login page', () => {
  beforeEach(() => {
    cy.logout()
    cy.visit('/login')
  })

  it('renders the brand panel and form', () => {
    cy.contains('Good to have').should('be.visible')
    cy.contains('Welcome back').should('be.visible')
    cy.get('input[name="email"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('contain', 'Login')
  })

  it('shows a link to the join page', () => {
    cy.contains('Join the community').should('have.attr', 'href', '/join')
  })

  it('displays an error on invalid credentials', () => {
    cy.mockGraphQL({ Login: null }) // will fall through to error branch

    cy.intercept('POST', '**/graphql', { errors: [{ message: 'User not found' }] })

    cy.get('input[name="email"]').type('bad@user.com')
    cy.get('input[name="password"]').type('wrongpass')
    cy.get('button[type="submit"]').click()

    cy.contains('User not found').should('be.visible')
  })

  it('redirects to /dashboard on successful login', () => {
    cy.intercept('POST', '**/graphql', {
      data: { login: 'mock-token-cypress' },
    })

    cy.get('input[name="email"]').type('user@example.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/dashboard')
  })
})

describe('Join page', () => {
  beforeEach(() => {
    cy.logout()
    cy.visit('/join')
  })

  it('renders the gold brand panel and registration form', () => {
    cy.contains('Join a kinder').should('be.visible')
    cy.contains('Create account').should('be.visible')
    cy.get('input[name="name"]').should('be.visible')
    cy.get('input[name="email"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
    cy.get('select[name="role"]').should('be.visible')
    cy.get('button[type="submit"]').should('contain', 'Join Now')
  })

  it('role selector has Volunteer and Seeker options', () => {
    cy.get('select[name="role"]').within(() => {
      cy.contains('Volunteer').should('exist')
      cy.contains('Seeker').should('exist')
    })
  })

  it('shows a link back to login', () => {
    cy.contains('Sign in').should('have.attr', 'href', '/login')
  })
})
