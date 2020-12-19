/**
 * Command in Control Turbine Test File
 * Maintained by: David Padilla-Arenivar
 * Boilerplate by: David Padilla-Arenivar
 *   This file contains tests that verify that the Turbines API routes are working as intended.
 *   The main function of the set is to test that a Turbine can be inserted into the turbines collection in
 *   the DB, can be retrieved along with any existing entries, and that entries are not created when values are
 *   missing or key names are incorrect.
 **/

const request = require('supertest');

const app = require('../app');

function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
    // .toFixed() returns string, so ' * 1' is a trick to convert to number
}

let randomSixDigitNumber = Math.floor(100000 + Math.random() * 900000);
let randomLat = getRandomInRange(-180, 180, 3);
let randomLong = getRandomInRange(-180, 180, 3);

let demoTurbine = {
    lat: randomLat,
    long: randomLong
};

let demoGatewayUpdate = {
    gwID: Math.floor(100000 + Math.random() * 900000),
    wtID: null
};

// This test fails because 1 !== 2
it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
});

it('Async test', async done => {
    // Do your async tests here

    done()
});

describe('Create Turbine', () => {
    it('succeeds with correct formatting', async (done) => {
        // Sends POST request to /api/turbines/add along with the sample turbine defined above
        const response = await request(app).post('/api/turbines/add').send(demoTurbine);
        // Check if response went through OK
        expect(response.status).toBe(200);
        // Check if the created entry in the turbines DB matches the one we defined above
        expect(response.body.lat).toBe(demoTurbine.lat);
        demoGatewayUpdate.wtID = response.body.wtID;
        // End test
        done()
    });

    it('GET the test endpoint api/turbines/', async done => {
        // Sends GET Request to /api/turbines/ endpoint
        const response = await request(app).get('/api/turbines/');
        // Check if request was OK
        expect(response.status).toBe(200);
        // Check if the most recent DB entry matches the one we just sent in
        expect(response.body[response.body.length-1].lat).toBe(demoTurbine.lat);

        console.log("# of Turbine Entries: " + response.body.length);
        console.log("Our test entry wtID: " + response.body[response.body.length-1].wtID);
        // End test
        done()
    });

    it('fails with invalid credentials', async (done) => {
        // Create a dummy turbine with incorrect values
        const turbine = {lat:'test435', long: '5PM, 10-12-19'};
        // Send the dummy turbine as POST to /api/turbines/add
        const response = await request(app).post('/api/turbines/add').send(turbine);
        // Check if the response came back with a 401 error
        expect(response.status).toBe(401);
        // End test
        done()
    });

    it('fails with missing credentials', async (done) => {
        // Create a turbine object that is completely empty
        const turbine = {};
        // Send the object as a POST to /api/turbines/add
        const response = await request(app).post('/api/turbines/add').send(turbine);
        // Check if the response came back with a 401 error
        expect(response.status).toBe(401);
        // End test
        done()
    });

    /** TEST GATEWAY UPDATE ENDPOINTS **/

    it('succeeds with correct formatting', async (done) => {
        // Sends POST request to /api/turbines/updateGatewayID along with the sample
        // turbine gwID defined above
        const response = await request(app).post('/api/turbines/updateGatewayID').send(demoGatewayUpdate);
        // Check if response went through OK
        expect(response.status).toBe(200);
        // Check if we actually updated an entry in the DB
        expect(response.body.nModified).toBe(1);
        // End test
        done()
    });

    it('GET the test endpoint api/turbines/turbineInfo', async done => {
        // Sends GET Request to /api/turbines/defaultSetting endpoint
        const response = await request(app).get('/api/turbines/turbineInfo?wtID=' + demoGatewayUpdate.wtID);
        // Check if request was OK
        expect(response.status).toBe(200);
        // Check if the most recent DB entry matches the one we just sent in
        expect(response.body.gwID).toBe(demoGatewayUpdate.gwID);

        console.log("Our test settings entry gwID: " + response.body.gwID);
        // End test
        done()
    });


});