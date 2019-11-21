/// <reference types="cypress" />

const platforms = ['iphone-x', 'iphone-5']

describe('Feedback Tests', function() {
    platforms.forEach(platform => {
        it(`${platform}: should submit feedback`, () => {
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
            cy.wait(1000); // TODO: can shorten when I'm mocking the server response
            cy.get('ion-toast').then(toast => {
                return toast[0].shadowRoot.querySelector('.toast-wrapper .toast-message').innerText;
            }).should('eq', 'Feedback sent successfully!')
        });

    });
});