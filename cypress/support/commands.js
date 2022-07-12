Cypress.Commands.add('fillMandatoryFieldAndSubmit', () => {
  cy.get('#firstName').type('Walmyr')
  cy.get('#lastName').type('Filho')
  cy.get('#email').type('a@a.com')
  cy.get('#open-text-area').type('string de teste', { delay: 0 })
  cy.get('button[type="submit"]').click()
})