/**
 * Command in Control GW Tests API File
 * Maintained by: David Padilla-Arenivar
 * Boilerplate by: David Padilla-Arenivar
 *   This file houses GW TestResult API, which allows for the storing and retrieving of data from the
 *   shared database. The information involved only relates to test objects, which contain the results of the
 *   GW's tests for CPU, Storage, and Memory functionality.
 **/

// Import and initialize Express
const express = require('express');
const router = express.Router();

// Import and initialize Mongoose and User Schema
let mongoose = require('mongoose');
require("../schemas/testResult");
let TestResult = mongoose.model('TestResult');

/** GET retrieve all test listings from the DB **/
router.get('/', function(req, res, next) {
    //Search for all tests, and return a callback.
    TestResult.find({}, (err, tests) =>{
        //If there is an error, return the error to response. Otherwise return the list of all users in JSON format.
        err ? res.status(401).json(err) : res.json(tests);
    });
});

/** GET clear all test listings from the DB (for testing purposes)**/
router.get('/clear', function(req, res, next) {
    TestResult.deleteMany({},(err, data)=>{
        //If there is an error, return the error to response. Otherwise return the list of all users in JSON format.
        err ? res.status(401).json(err) : res.json(data);
    });
});

/** POST adds a test to the DB **/
// Add new test to MongoDB
router.post('/add', function(req, res){

    // Get JSON out of request, along with parameters
    console.log(req.body);
    let requestData = req.body;
    let gwID = requestData.gwID; // gateway ID
    let wtID = requestData.wtID; // wind turbine ID
    let requestTimestamp = requestData.timestamp; // timestamp from gateway of when request was made
    let cpuIntResult = requestData.cpuIntResult; // CPU integer testing result, provided by GW
    let cpuPrimeResult = requestData.cpuPrimeResult; // CPU prime testing result, provided by GW
    let cpuFloatResult = requestData.cpuFloatResult; // CPU float testing result, provided by GW
    let storageResult = requestData.storageResult; // storage testing result, provided by GW
    let memoryResult = requestData.memoryResult; // memory testing result, provided by GW

    //Code to generate custom, workable timestamp. Yields a date string, XX/XX/XXXX, and time string, XX:XX:XX.
    const dateObj = new Date();
    const currDate = "" + (dateObj.getMonth()+1) + "/" + dateObj.getDate() + "/" + dateObj.getFullYear();
    console.log('currDate: ' + currDate);

    let hours = dateObj.getHours().toString();
    if(hours.length === 1){
        hours = "0" + hours;
    }

    let minutes = dateObj.getMinutes().toString();
    if(minutes.length === 1){
        minutes = "0" + minutes;
    }

    let seconds = dateObj.getSeconds().toString();
    if(seconds.length === 1){
        seconds = "0" + seconds;
    }

    const currTime = "" + hours + ":" + minutes + ":" + seconds;
    console.log("currTime: " + currTime);

    // Create a new test object with received data and current time.
    let newTest = new TestResult({
        gwID: gwID,
        wtID: wtID,
        sentTime: requestTimestamp,
        receivedTime:
            {
                date: currDate,
                time: currTime
            },
        cpuIntResult: cpuIntResult,
        cpuPrimeResult: cpuPrimeResult,
        cpuFloatResult: cpuFloatResult,
        storageResult: storageResult,
        memoryResult: memoryResult
    });

    // Save the test in the tests DB collection,
    // if there's an error, return status 401 with the error
    newTest.save((err, data)=>{
        err ? res.status(401).json(err) : res.json(data);
    });
});

module.exports = router;
