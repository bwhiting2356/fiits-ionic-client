/// <reference types="cypress" />

const fakeLocation = (latitude, longitude) =>  {
    return {
        onBeforeLoad(win) {
        cy.stub(win.navigator.geolocation, "getCurrentPosition", (cb, err) => {
            if (latitude && longitude) {
            return cb({ coords: { latitude, longitude } });
            }
            throw err({ code: 1 }); // 1: rejected, 2: unable, 3: timeout
        });
        }
    };
}

const platforms = ['iphone-x', 'iphone-5']
// const platforms = ['iphone-x'];

xdescribe('Search Tests', function() {
    platforms.forEach(platform => {
        it(`${platform}: should search using address input`, () => {
            cy.viewport(platform);
            cy.visit('http://localhost:8100', fakeLocation(37.780984, -122.408755));
            cy.url().should('include', '/search');
            cy.get('ion-item#origin ion-input').type('  576')
            cy.url().should('include', '/address-input');
            cy.wait(500);
            cy.get('ion-list ion-item:nth-child(3)').click();
            cy.get('ion-item#origin ion-input').should('have.value', '576 Natoma Street');
            cy.get('ion-item#destination ion-input').type('  123');
            cy.url().should('include', '/address-input');
            cy.wait(500);
            cy.get('ion-list ion-item:nth-child(2)').click();
            cy.get('ion-item#destination ion-input').should('have.value', "1231 Market Street");
            cy.wait(500);
            cy.get('#button-container ion-button').first().click();
            cy.url().should('include', '/trip-details');
        });
    });

    // platforms.forEach(platform => {
    //     it(`${platform}: should search using station marker buttons`, () => {
    //         cy.viewport(platform);
    //         cy.visit('http://localhost:8100', fakeLocation(37.780984, -122.408755));
    //         cy.url().should('include', '/search');
    //         cy.wait(10000);
    
    //         cy.window().then(win => {
    //             return win.document.querySelector("[title='station-marker-1']").click();
    //         });
    
    //         cy.get('#marker-info-window');
    //         cy.get('#from-station').then(val => val.click());
    //         cy.get('ion-item#origin ion-input').should('have.value', 'Cyril Magnin St at Ellis St');
    
    //         cy.wait(10000);
    //         cy.window().then(win => {
    //             return win.document.querySelector("[title='station-marker-0']").click();
    //         });
    
    //         cy.get('#marker-info-window');
    //         cy.get('#to-station').then(val => val.click());
    //         cy.get('ion-item#destination ion-input').should('have.value', 'Powell St BART Station (Market St at 4th St)');
    
    //         cy.get('ion-button').click();
    //         cy.url().should('include', '/trip-details');
    //     });
    // });

    platforms.forEach(platform => {
        it(`${platform}: should search using current location button`, () => {
            cy.viewport(platform);
            cy.visit('http://localhost:8100', fakeLocation(37.780984, -122.408755));
            cy.url().should('include', '/search');
            cy.get('ion-item#origin ion-input').click();
            cy.url().should('include', '/address-input');
            cy.wait(1000);
            cy.get('#current-location').click();
            cy.get('ion-item#origin ion-input').should('have.value', '92 6th St, San Francisco, CA 94103, USA');
        })
    });
})