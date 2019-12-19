describe('Auth guard', () => {
    it('should redirect from /trips to /sign-in if the user is not signed in', () => {
        cy.visit('http://localhost:8100/trips');
        cy.url().should('include', '/sign-in');
    });

    it('should redirect from /payments to /sign-in if the user is not signed in', () => {
        cy.visit('http://localhost:8100/payments');
        cy.url().should('include', '/sign-in');
    });

    it('should redirect from /address-input to /search if there is no address-type chosen (navigated to directly)', () => {
      cy.visit('http://localhost:8100/address-input');
      cy.wait(500);
      cy.url().should('include', '/search');
    });

    it('should redirect from /trip-details to /search if there is no trip search in progress (navigated to directly)', () => {
        cy.visit('http://localhost:8100/trip-details');
        cy.wait(500);
        cy.url().should('include', '/search');
      });
})