/**
 * Command in Control Test Result Test File
 * Maintained by: David Padilla-Arenivar
 * Boilerplate by: David Padilla-Arenivar
 *   This file contains tests that verify that the Tests API routes are working as intended.
 *   The main function of the set is to test that a TestResult object can be inserted into the tests collection in
 *   the DB, can be retrieved along with any existing entries, and that entries are not created when values are
 *   missing or key names are incorrect.
 **/
const app = require('../app');
const request = require('supertest');

let demoTest = {
    gwID: 222222,
    wtID: 22222222,
    timestamp: new Date(),
    cpuIntResult: "OK",
    cpuPrimeResult: "OK",
    cpuFloatResult: "OK",
    storageResult: "OK",
    memoryResult: "OK"

};

// This test passes because 1 === 1
it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
});

it('Async test', async done => {
    // Do your async tests here

    done()
});

// This is the collection of tests that are designed to check if the test routes are working as intended
// All of these tests are generated using the Jest and Supertest packages
describe('Create Test', () => {
    it('succeeds with correct formatting', async (done) => {
        // Sends POST request to /api/tests/add along with the sample test defined above
        const response = await request(app).post('/api/tests/add').send(demoTest);
        // Check if response went through OK
        expect(response.status).toBe(200);
        // Check if the created entry in the tests DB matches the one we defined above
        expect(response.body.gwID).toBe(demoTest.gwID);
        // End test
        done()
    });

    it('GET the test endpoint api/tests/', async done => {
        // Sends GET Request to /api/tests/ endpoint
        const response = await request(app).get('/api/tests/');
        // Check if request was OK
        expect(response.status).toBe(200);
        // Check if the most recent DB entry matches the one we just sent in
        expect(response.body[response.body.length-1].gwID).toBe(demoTest.gwID);

        console.log("# of Test Entries: " + response.body.length);
        console.log("Our test entry gwID: " + response.body[response.body.length-1].gwID);
        // End test
        done()
    });

    it('fails with invalid inputs', async (done) => {
        // Create a dummy test with incorrect values
        const test = {gwID:'test435', sentTime: '5PM, 10-12-19'};
        // Send the dummy test as POST to /api/tests/add
        const response = await request(app).post('/api/tests/add').send(test);
        // Check if the response came back with a 401 error
        expect(response.status).toBe(401);
        // End test
        done()
    });

    it('fails with missing inputs', async (done) => {
        // Create a test object that is completely empty
        const test = {};
        // Send the object as a POST to /api/tests/add
        const response = await request(app).post('/api/tests/add').send(test);
        // Check if the response came back with a 401 error
        expect(response.status).toBe(401);
        // End test
        done()
    });
});