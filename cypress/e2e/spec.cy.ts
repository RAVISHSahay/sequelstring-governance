describe('SequelString CRM', () => {
    it('loads the dashboard', () => {
        cy.visit('/');
        cy.contains('SequelString').should('be.visible');
    });

    it('navigates to Account Map', () => {
        // Assuming auth is mocked or bypassed for this test environment
        // If login is required, we would need to simulate it
        cy.visit('/accounts/map');
        cy.contains('Account Map').should('exist'); // Adjust selector as needed
    });
});
