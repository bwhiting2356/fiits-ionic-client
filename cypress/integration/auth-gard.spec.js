describe('Auth guard', () => {
    it('should redirect from /trips to /sign-in if the user is not signed in', () => {
        cy.visit('http://localhost:8100/trips');
        cy.url().should('include', '/sign-in');
    });

    it('should redirect from /payments to /sign-in if the user is not signed in', () => {
        cy.visit('http://localhost:8100/payments');
        cy.url().should('include', '/sign-in');
    });
})