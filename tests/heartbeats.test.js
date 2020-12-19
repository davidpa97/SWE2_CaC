/**
 * Command in Control Heartbeat Test File
 * Maintained by: David Padilla-Arenivar
 * Boilerplate by: David Padilla-Arenivar
 *   This file contains tests that verify that the Heartbeats API routes are working as intended.
 *   The main function of the set is to test that a Heartbeat can be inserted into the heartbeats collection in
 *   the DB, can be retrieved along with any existing entries, and that entries are not created when values are
 *   missing or key names are incorrect.
 **/

const request = require('supertest');

const app = require('../app');

let randomSixDigitNumber = Math.floor(100000 + Math.random() * 900000);
let randomEightDigitNumber = Math.floor(10000000 + Math.random() * 90000000);

let demoHeartbeat = {
    gwID:randomSixDigitNumber,
    wtID: randomEightDigitNumber,
    timestamp: new Date()
};

let demoHeartbeatSetting = {
    gwID: demoHeartbeat.gwID
    // This one doesn't include hbFrequency so the default is set
};

let demoHeartbeatSettingUpdate = {
    gwID: demoHeartbeatSetting.gwID,
    hbFrequency: 45
};

// This test fails because 1 !== 2
it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
});

it('Async test', async done => {
    // Do your async tests here

    done()
});

describe('Create Heartbeat', () => {
    it('succeeds with correct formatting', async (done) => {
        // Sends POST request to /api/heartbeats/add along with the sample heartbeat defined above
        const response = await request(app).post('/api/heartbeats/add').send(demoHeartbeat);
        // Check if response went through OK
        expect(response.status).toBe(200);
        // Check if the created entry in the heartbeats DB matches the one we defined above
        expect(response.body.gwID).toBe(demoHeartbeat.gwID);
        // End test
        done()
    });

    it('GET the test endpoint api/heartbeats/', async done => {
        // Sends GET Request to /api/heartbeats/ endpoint
        const response = await request(app).get('/api/heartbeats/');
        // Check if request was OK
        expect(response.status).toBe(200);
        // Check if the most recent DB entry matches the one we just sent in
        expect(response.body[response.body.length-1].gwID).toBe(demoHeartbeat.gwID);

        console.log("# of Heartbeat Entries: " + response.body.length);
        console.log("Our test entry gwID: " + response.body[response.body.length-1].gwID);
        // End test
        done()
    });

    it('fails with invalid credentials', async (done) => {
        // Create a dummy heartbeat with incorrect values
        const heartbeat = {gwID:'test435', sentTime: '5PM, 10-12-19'};
        // Send the dummy heartbeat as POST to /api/heartbeats/add
        const response = await request(app).post('/api/heartbeats/add').send(heartbeat);
        // Check if the response came back with a 401 error
        expect(response.status).toBe(401);
        // End test
        done()
    });

    it('fails with missing credentials', async (done) => {
        // Create a heartbeat object that is completely empty
        const heartbeat = {};
        // Send the object as a POST to /api/heartbeats/add
        const response = await request(app).post('/api/heartbeats/add').send(heartbeat);
        // Check if the response came back with a 401 error
        expect(response.status).toBe(401);
        // End test
        done()
    });

    /** TEST SETTING ENDPOINTS **/

    it('succeeds with correct formatting', async (done) => {
        // Sends POST request to /api/heartbeats/addDefaultSetting along with the sample
        // heartbeat setting defined above
        const response = await request(app).post('/api/heartbeats/addDefaultSetting').send(demoHeartbeatSetting);
        // Check if response went through OK
        expect(response.status).toBe(200);
        // Check if the created entry in the heartbeats DB matches the one we defined above
        expect(response.body.gwID).toBe(demoHeartbeatSetting.gwID);
        // End test
        done()
    });

    it('GET the test endpoint api/heartbeats/defaultSettings', async done => {
        // Sends GET Request to /api/heartbeats/defaultSetting endpoint
        const response = await request(app).get('/api/heartbeats/defaultSettings?gwID=' + demoHeartbeatSetting.gwID);
        // Check if request was OK
        expect(response.status).toBe(200);
        // Check if the most recent DB entry matches the one we just sent in
        expect(response.body.gwID).toBe(demoHeartbeatSetting.gwID);

        console.log("Our test settings entry gwID: " + response.body.gwID);
        // End test
        done()
    });

    it('succeeds with correct formatting', async (done) => {
        console.log("previous gwID: " + demoHeartbeatSetting.gwID);
        console.log("current gwID: " + demoHeartbeatSettingUpdate.gwID);
        // Sends POST request to /api/heartbeats/editDefaultSetting along with the sample heartbeat
        // setting defined above
        const response = await request(app).post('/api/heartbeats/editDefaultSettings').send(demoHeartbeatSettingUpdate);
        // Check if response went through OK
        expect(response.status).toBe(200);
        // Check if we actually updated an entry in the DB
        expect(response.body.nModified).toBe(1);
        // End test
        done()
    });


});