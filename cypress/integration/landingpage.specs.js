/* eslint-disable no-undef */

// Tests for landing page
describe('Test for landing page', () => {
    before(() => {
        cy.visit('/')
    })
    it('renders the title', () => {
        cy.get('[data-cy=landingTitle]')
    })
    it('can cancel projecta adding', () => {
        cy.get('[data-cy=addButton]').click()
        cy.get('[data-cy=inputName]').type('Project1')
        cy.get('[data-cy=cancel]').click()
        cy.get('[data-cy=projectGrid]').should('not.contain', 'Project1')
    })
    it('add project and navigate to project page', () => {
        cy.get('[data-cy=addButton]').click()
        cy.get('[data-cy=inputName]').type('New Project')
        cy.get('[data-cy=addProject]').click()
        cy.get('[data-cy=projectGrid]').contains('New Project').click()
    })
})
