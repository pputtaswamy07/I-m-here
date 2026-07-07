import './commands'

// IntersectionObserver fires its callback asynchronously — by the time
// Cypress asserts .should('be.visible'), the opacity:0 → opacity:1
// transition driven by the observer may not have happened yet.
// This mock replaces the real browser API with one that fires immediately
// when observe() is called, so scroll-animated sections are always visible
// during tests without any artificial waits.
Cypress.on('window:before:load', (win) => {
  win.IntersectionObserver = class MockIntersectionObserver {
    constructor(callback) {
      this.callback = callback
    }
    observe(el) {
      this.callback([{ isIntersecting: true, target: el }])
    }
    disconnect() {}
    unobserve() {}
  }
})
