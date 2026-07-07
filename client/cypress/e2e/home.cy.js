describe('Home page', () => {
  beforeEach(() => {
    cy.logout()
    cy.visit('/')
  })

  it('renders the navbar with brand and navigation links', () => {
    cy.contains("I'm here").should('be.visible')
    cy.contains('About').should('be.visible')
    cy.contains('Join').should('be.visible')
  })

  it('shows the hero section with Get Started button', () => {
    cy.contains('volunteer your time').should('be.visible')
    cy.contains('Get Started').should('be.visible')
  })

  it('Get Started button navigates to /join', () => {
    cy.contains('Get Started').click()
    cy.url().should('include', '/join')
  })

  it('Join link in navbar navigates to /join', () => {
    cy.contains('Join').click()
    cy.url().should('include', '/join')
  })

  it('brand name navigates to home when clicked', () => {
    cy.contains('Join').click()
    cy.contains("I'm here").click()
    cy.url().should('eq', Cypress.config('baseUrl') + '/')
  })

  it('scrolls to Why We Care section', () => {
    cy.contains('Why we care').scrollIntoView().should('be.visible')
  })

  it('scrolls to Follow Our Journey section', () => {
    cy.contains('Follow Our Journey').scrollIntoView().should('be.visible')
  })
})
