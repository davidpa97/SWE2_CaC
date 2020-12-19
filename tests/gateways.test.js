/**
 * Command in Control Test Result Test File
 * Maintained by: David Padilla-Arenivar
 * Boilerplate by: David Padilla-Arenivar
 *   This file contains tests that verify that the Gateways API routes are working as intended.
 *   The main function of the set is to test that a Gateway object can be inserted into the gateways collection in
 *   the DB, can be retrieved along with any existing entries, and that entries are not created when values are
 *   missing or key names are incorrect.
 **/

const request = require('supertest');
const app = require('../app');

let demoGateway = {
    name: "testGateway" + Math.floor(100 + Math.random() * 900),
    manager: "testUser" + Math.floor(100 + Math.random() * 900)

};

let demoUpdateGatewayTurbine = {
    gwID: null,
    turbines: 88888888
};

// This test passes because 1 === 1
it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
});

it('Async test', async done => {
    // Do your async tests here

    done()
});

// This is the collection of tests that are designed to check if the gateway routes are working as intended
// All of these tests are generated using the Jest and Supertest packages
describe('Create Gateway', () => {
    it('succeeds with correct formatting', async (done) => {
        // Sends POST request to /api/gateways/add along with the sample gateway defined above
        const response = await request(app).post('/api/gateways/add').send(demoGateway);
        // Check if response went through OK
        expect(response.status).toBe(200);
        // Check if the created entry in the gateway DB matches the one we defined above
        expect(response.body.name).toBe(demoGateway.name);
        // End test
        done()
    });

    it('GET the test endpoint api/gateways/', async done => {
        // Sends GET Request to /api/gateways/ endpoint
        const response = await request(app).get('/api/gateways/');
        // Check if request was OK
        expect(response.status).toBe(200);
        // Check if the most recent DB entry matches the one we just sent in
        expect(response.body[response.body.length-1].name).toBe(demoGateway.name);
        demoUpdateGatewayTurbine.gwID = response.body[response.body.length-1].gwID;
        console.log("Obtained gwID: " + demoUpdateGatewayTurbine.gwID);
        console.log("# of Gateway Entries: " + response.body.length);
        console.log("Our test entry gateway name: " + response.body[response.body.length-1].name);
        // End test
        done()
    });

    it('POST the test endpoint api/gateways/updateTurbineList', async done => {
        console.log("Obtained gwID: " + demoUpdateGatewayTurbine.gwID);
        // Sends POST Request to /api/gateways/updateTurbineList endpoint
        const response = await request(app).post('/api/gateways/updateTurbineList').send(demoUpdateGatewayTurbine);
        // Check if request was OK
        expect(response.status).toBe(200);
        // Check if we actually updated an entry in the DB
        expect(response.body.nModified).toBe(1);
        // End test
        done()
    });

    it('GET the test endpoint api/gateways/gatewayInfo', async done => {
        console.log("/api/gateways/gatewayInfo?gwID=" + demoUpdateGatewayTurbine.gwID);
        // Sends GET Request to /api/gateways/gatewayInfo endpoint
        const response = await request(app).get('/api/gateways/gatewayInfo?gwID=' + demoUpdateGatewayTurbine.gwID);
        // Check if request was OK
        expect(response.status).toBe(200);
        // Check if the most recent DB entry matches the one we just sent in
        expect(response.body.gwID).toBe(demoUpdateGatewayTurbine.gwID);

        console.log("# of Gateway Entries: " + response.body.length);
        console.log("Our test entry gateway gwID: " + response.body.gwID);
        // End test
        done()
    });

    it('fails with invalid inputs', async (done) => {
        // Create a dummy test with incorrect values
        const gateway = {name:['blah','blah'], manager: 45};
        // Send the dummy test as POST to /api/tests/add
        const response = await request(app).post('/api/gateways/add').send(gateway);
        // Check if the response came back with a 401 error
        expect(response.status).toBe(401);
        // End test
        done()
    });

    it('fails with missing inputs', async (done) => {
        // Create a test object that is completely empty
        const gateway = {};
        // Send the object as a POST to /api/tests/add
        const response = await request(app).post('/api/gateways/add').send(gateway);
        // Check if the response came back with a 401 error
        expect(response.status).toBe(401);
        // End test
        done()
    });
});