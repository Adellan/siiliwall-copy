/* eslint-disable no-undef */

// Tests for adding users and boards. Navigation to board that is created in DummyData.js

// TODO
// Make tests for canceling board adding new board"
// Add second board to project

describe('Tests for project page', () => {
    before(() => {
        cy.visit('/projects/9da1b35f-181a-4397-a5a5-47abced10a66')
    })
    it('can cancel adding the user', () => {
        cy.get('[data-cy=addUser]').click()
        cy.get('[data-cy=nameOfUser]').type('Test User1')
        cy.get('[data-cy=cancel]').click()
    })
    it('can add the user', () => {
        cy.get('[data-cy=addUser]').click()
        cy.get('[data-cy=nameOfUser]').type('Test User1')
        cy.get('[data-cy=addUserToDb]').click()
    })

    it('add boards and navigate to new board', () => {
        cy.get('[data-cy=addBoard]').click()
        cy.get('[data-cy=nameInput]').type('New Board1')
        cy.get('[data-cy=shortForm]').type('NEBO')
        cy.get('[data-cy=addNewBoard]').click()
        cy.get('[data-cy=boardGrid]').should('contain', 'New Board1')

        // Apollo error occures in nameInput field when adding second board
        /* cy.get('[data-cy=addBoard]').click()
        cy.get('[data-cy=nameInput]').type('New Board2')
        cy.get('[data-cy=shortForm]').type('NEBO2')
        cy.get('[data-cy=addNewBoard]').click()
        cy.get('[data-cy=boardGrid]').should('contain', 'New Board2') */

        cy.get('[data-cy=boardGrid]').contains('New Board1').click()
    })
})
