/**
 * Command in Control Software Download Link Test File
 * Maintained by: David Padilla-Arenivar
 * Boilerplate by: David Padilla-Arenivar
 *   This file contains tests that verify that the SoftwareLinks API routes are working as intended.
 *   The main function of the set is to test that a SoftwareLink can be inserted into the softwareLinks collection in
 *   the DB, can be retrieved along with any existing entries, and that entries are not created when values are
 *   missing or key names are incorrect.
 **/

const request = require('supertest');

const app = require('../app');

let demoSoftwareLink = {
    title: "A Test Title", // Software package title
    link: "testlink.com", // Link to the software package
    description: "This is just a test!" // Description of software package
};

// This test passes because 1 === 1
it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
});

it('Async test', async done => {
    // Do your async tests here

    done()
});

// This is the collection of tests that are designed to check if the user routes are working as intended
// All of these tests are generated using the Jest and Supertest packages
describe('Create SoftwareLink', () => {
    it('succeeds with correct formatting', async (done) => {
            // Sends POST request to /api/softwareLinks/add along with the sample link defined above
            const response = await request(app).post('/api/softwareLinks/add').send(demoSoftwareLink);
            // Check if response went through OK
            console.log(response.error);
            expect(response.status).toBe(200);
            // Check if the created entry in the users DB matches the one we defined above
            expect(response.body.title).toBe(demoSoftwareLink.title);
            // End test
            done()
        }
    );

    it('GET the test endpoint api/softwareLinks/', async done => {
        // Sends GET Request to /api/softwareLinks/ endpoint
        const response = await request(app).get('/api/softwareLinks/');
        // Check if request was OK
        expect(response.status).toBe(200);
        // Check if the most recent DB entry matches the one we just sent in
        expect(response.body[response.body.length-1].title).toBe(demoSoftwareLink.title);

        console.log("# of SoftwareLink Entries: " + response.body.length);
        console.log("Our test entry title: " + response.body[response.body.length-1].title);
        // End test
        done()
    });

    it('fails with invalid inputs', async (done) => {
        // Create a dummy user with incorrect values
        const link = {title:456, link: [], description: 2345};
        // Send the dummy link as POST to /api/softwareLinks/add
        const response = await request(app).post('/api/softwareLinks/add').send(link);
        // Check if the response came back with a 401 error
        expect(response.status).toBe(401);
        // End test
        done()
    });

    it('fails with missing inputs', async (done) => {
        // Create a softwareLink object that is completely empty
        const link = {};
        // Send the object as a POST to /api/softwareLinks/add
        const response = await request(app).post('/api/softwareLinks/add').send(link);
        // Check if the response came back with a 401 error
        expect(response.status).toBe(401);
        // End test
        done()
    });
});