/**
 * Command in Control Diagnostic Test File
 * Maintained by: David Padilla-Arenivar
 * Boilerplate by: David Padilla-Arenivar
 *   This file contains tests that verify that the Diagnostics API routes are working as intended.
 *   The main function of the set is to test that a Diagnostic can be inserted into the diagnostics collection in
 *   the DB, can be retrieved along with any existing entries, and that entries are not created when values are
 *   missing or key names are incorrect.
 **/

const request = require('supertest');
const app = require('../app');

const dateObj = new Date();
const date = "" + (dateObj.getMonth()+1) + "/" + dateObj.getDate() + "/" + dateObj.getFullYear();

let demoDiagnostic = {
    gwID: 111111,
    wtID: 11111111,
    timestamp: new Date(),
    gearboxTemp: "40",
    rotorTemp: "34",
    rotorSpeed: "60",
    gridVoltage: "120",
    windSpeed: "210"
};

let demoScheduledDiagnostic = {
    "gwID": 111111,
    "wtID": 11111111,
    "setTime":
        {
            "date":"12/6/2019",
            "time":"00:16:50"
        }
};

// This test passes because 1 === 1
it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
});

it('Async test', async done => {
    // Do your async tests here

    done()
});

// This is the collection of tests that are designed to check if the diagnostic routes are working as intended
// All of these tests are generated using the Jest and Supertest packages
describe('Create Diagnostic', () => {
    it('can create scheduled diagnostic entry', async (done) => {
        // Sends POST request to /api/diagnostics/add along with the sample diagnostic defined above
        const response = await request(app).post('/api/diagnostics/addScheduled').send(demoScheduledDiagnostic);
        // Check if response went through OK
        expect(response.status).toBe(200);
        // Check if the created entry in the diagnostics DB matches the one we defined above
        expect(response.body.gwID).toBe(demoScheduledDiagnostic.gwID);
        // End test
        done()
    });

    it('succeeds with correct formatting', async (done) => {
        // Sends POST request to /api/diagnostics/add along with the sample diagnostic defined above
        const response = await request(app).post('/api/diagnostics/add').send(demoDiagnostic);
        // Check if response went through OK
        expect(response.status).toBe(200);
        // Check if the created entry in the diagnostics DB matches the one we defined above
        expect(response.body.data.gwID).toBe(demoDiagnostic.gwID);
        // Check if the most recent scheduled diag. entry in the diagnostics DB matches the one we defined above
        expect(response.body.scheduledDiagnosticList[response.body.scheduledDiagnosticList.length-1].gwID)
            .toBe(demoScheduledDiagnostic.gwID);
        // End test
        done()
    });

    it('GET the test endpoint api/diagnostics/', async done => {
        // Sends GET Request to /api/diagnostics/ endpoint
        const response = await request(app).get('/api/diagnostics/');
        // Check if request was OK
        expect(response.status).toBe(200);
        // Check if the most recent DB entry matches the one we just sent in
        expect(response.body[response.body.length-1].gwID).toBe(demoDiagnostic.gwID);

        console.log("# of Diagnostic Entries: " + response.body.length);
        console.log("Our test entry gwID: " + response.body[response.body.length-1].gwID);
        // End test
        done()
    });

    it('fails with invalid inputs', async (done) => {
        // Create a dummy diagnostic with incorrect values
        const diagnostic = {gwID:'test435', sentTime: '5PM, 10-12-19'};
        // Send the dummy diagnostic as POST to /api/diagnostics/add
        const response = await request(app).post('/api/diagnostics/add').send(diagnostic);
        // Check if the response came back with a 401 error
        expect(response.status).toBe(401);
        // End test
        done()
    });

    it('fails with missing inputs', async (done) => {
        // Create a diagnostic object that is completely empty
        const diagnostic = {};
        // Send the object as a POST to /api/diagnostics/add
        const response = await request(app).post('/api/diagnostics/add').send(diagnostic);
        // Check if the response came back with a 401 error
        expect(response.status).toBe(401);
        // End test
        done()
    });
});
// describe('Get Daily Diagnostics', () => {
//     it('succeeds with correct formatting', async (done) => {
//         // Sends GET request to /api/diagnostics/add along with the sample diagnostic defined above
//         const response = await request(app).get('/api/diagnostics/dailyDiagnostics?date=' + date).send(demoDiagnostic);
//         // Check if response went through OK
//         expect(response.status).toBe(200);
//         // Check if the created entry in the diagnostics DB matches the one we defined above
//         expect(response.body.length).toBeGreaterThanOrEqual(0);
//         // End test
//         done()
//     });
// });