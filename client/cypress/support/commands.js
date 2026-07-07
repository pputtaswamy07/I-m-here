// Stub the GraphQL endpoint so Cypress tests never need a live server
Cypress.Commands.add('mockGraphQL', (operationMocks) => {
  cy.intercept('POST', '**/graphql', (req) => {
    const { operationName, query } = req.body
    const key = operationName || (query || '').trim().split(/\s+/)[1]
    if (operationMocks[key]) {
      req.reply({ data: operationMocks[key] })
    }
  }).as('graphql')
})

// Log in by injecting a token directly into localStorage
Cypress.Commands.add('loginAs', (token = 'mock-cypress-token') => {
  cy.window().then((win) => {
    win.localStorage.setItem('token', token)
  })
})

Cypress.Commands.add('logout', () => {
  cy.window().then((win) => win.localStorage.clear())
})
