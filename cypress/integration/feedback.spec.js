/// <reference types="cypress" />

const platforms = ['iphone-x', 'iphone-5', 'samsung-note9', 'macbook-15'];

describe('Feedback Tests', function() {
    platforms.forEach(platform => {
        it(`${platform}: should show toast saying 'Feedback send successfully!'`, () => {
            cy.server();
            cy.route({
                url: 'https://fiits-backend.herokuapp.com/feedback',
                method: 'POST',
                status: 200,
                response: {},
                delay: 100
            }).as('feedback')
            cy.viewport(platform);
            cy.visit('http://localhost:8100/feedback');
            cy.get('ion-button')
                .contains('Send Feedback')
                .and('have.attr', 'disabled')
            cy.get('ion-textarea').type('Cool app.');
            cy.get('ion-button')
                .contains('Send Feedback')
                .and('not.have.attr', 'disabled')
            cy.get('ion-button').click()
            cy.wait(800); 
            cy.get('ion-toast').then(toast => {
                return toast[0].shadowRoot.querySelector('.toast-wrapper .toast-message').innerText;
            }).should('eq', 'Feedback sent successfully!')
            cy.get('ion-textarea').should('have.text', '')
            cy.wait('@feedback');
        });

        it(`${platform}: should show toast saying 'Error sending feedback'`, () => {
            cy.server();
            cy.route({
                url: 'https://fiits-backend.herokuapp.com/feedback',
                method: 'POST',
                status: 500,
                response: {}
            }).as('feedback');
            cy.viewport(platform);
            cy.visit('http://localhost:8100/feedback');
            cy.get('ion-button')
                .contains('Send Feedback')
                .and('have.attr', 'disabled')
            cy.get('ion-textarea').type('Cool app.');
            cy.get('ion-button')
                .contains('Send Feedback')
                .and('not.have.attr', 'disabled')
            cy.get('ion-button').click()
            cy.wait(800); 
            cy.get('ion-toast').then(toast => {
                return toast[0].shadowRoot.querySelector('.toast-wrapper .toast-message').innerText;
            }).should('eq', 'Error sending feedback')
            cy.get('ion-textarea').should('have.text', 'Cool app.')
            cy.wait('@feedback');
        });
    });
});