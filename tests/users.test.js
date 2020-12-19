/**
 * Command in Control User Test File
 * Maintained by: David Padilla-Arenivar
 * Boilerplate by: David Padilla-Arenivar
 *   This file contains tests that verify that the Users API routes are working as intended.
 *   The main function of the set is to test that a User can be inserted into the users collection in
 *   the DB, can be retrieved along with any existing entries, and that entries are not created when values are
 *   missing or key names are incorrect.
 **/

const app = require('../app');
const request = require('supertest');

const demoUser = {
    username : "testUsername" + Math.floor(100 + Math.random() * 900),
    email : "testEmail" + Math.floor(100 + Math.random() * 900) + "@email.com",
    password : "testPassword" + Math.floor(100 + Math.random() * 900)

};

let demoUserLogin = {
    username : demoUser.username,
    password : demoUser.password

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
describe('Create User', () => {
    it('succeeds with correct formatting', async (done) => {
        // Sends POST request to /api/users/add along with the sample user defined above
        const response = await request(app).post('/api/users/add').send(demoUser);
        // Check if response went through OK
        console.log(response.error);
        expect(response.status).toBe(200);
        // Check if the created entry in the users DB matches the one we defined above
        expect(response.body.username).toBe(demoUser.username);
        // End test
        done()
    }
    );

    it('GET the test endpoint api/users/', async done => {
        // Sends GET Request to /api/users/ endpoint
        const response = await request(app).get('/api/users/');
        // Check if request was OK
        expect(response.status).toBe(200);
        // Check if the most recent DB entry matches the one we just sent in
        expect(response.body[response.body.length-1].username).toBe(demoUser.username);

        console.log("# of User Entries: " + response.body.length);
        console.log("Our test entry username: " + response.body[response.body.length-1].username);
        // End test
        done()
    });

    it('fails with invalid inputs', async (done) => {
        // Create a dummy user with incorrect values
        const user = {username:456, email: '5PM, 10-12-19', password: 2345};
        // Send the dummy user as POST to /api/users/add
        const response = await request(app).post('/api/users/add').send(user);
        // Check if the response came back with a 401 error
        expect(response.status).toBe(401);
        // End test
        done()
    });

    it('fails with missing inputs', async (done) => {
        // Create a user object that is completely empty
        const user = {};
        // Send the object as a POST to /api/users/add
        const response = await request(app).post('/api/users/add').send(user);
        // Check if the response came back with a 401 error
        expect(response.status).toBe(401);
        // End test
        done()
    });

    it('succeeds with correct formatting', async (done) => {
        // Sends POST request to /api/users/login along with the sample user defined above
        const response = await request(app).post('/api/users/login').send(demoUserLogin);
        // Check if response went through OK
        expect(response.status).toBe(200);
        // Check if the created entry in the users DB matches the one we defined above
        expect(response.body.loginSuccessful).toBe(true);
        // End test
        done()
    });
});