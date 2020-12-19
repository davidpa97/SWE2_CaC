/**
 * Command in Control Diagnostics API File
 * Maintained by: David Padilla-Arenivar
 * Boilerplate by: David Padilla-Arenivar
 *   This file houses the diagnostics API, which allows for the storing and retrieving of data from the
 *   shared database. The information involved only relates to diagnostic objects, which contain basic device
 *   diagnostic information generated by the IoT device gateway.
 **/

// Import and initialize Express
const express = require('express');
const router = express.Router();
let ws;
if (process.env.NODE_ENV !== 'test') {
    const WebSocket = require('ws');
    const URL = 'ws://localhost:3030';
    ws = new WebSocket(URL);
}

// Import and initialize Mongoose and User Schema
let mongoose = require('mongoose');
require("../schemas/diagnostic");
let Diagnostic = mongoose.model('Diagnostic');
require("../schemas/scheduledDiagnostic");
let ScheduledDiagnostic = mongoose.model('ScheduledDiagnostic');

/** GET retrieve all diagnostics listings from the DB **/
router.get('/', function(req, res, next) {
    //Search for all diagnostics, and return a callback.
    Diagnostic.find({}, (err, diagnostics) =>{
        //If there is an error, return the error to response. Otherwise return the list of
        // all diagnostics in JSON format.
        err ? res.status(401).json(err) : res.json(diagnostics);
    });
});

/** GET retrieve all scheduled diagnostics listings from the DB **/
router.get('/scheduled', function(req, res, next) {
    //Search for all scheduled diagnostics, and return a callback.
    ScheduledDiagnostic.find({}, (err, sDiagnostics) =>{
        //If there is an error, return the error to response. Otherwise return the list of
        // all scheduled diagnostics in JSON format.
        err ? res.status(401).json(err) : res.json(sDiagnostics);
    });
});

/** GET clear all diagnostics listings from the DB (for testing purposes)**/
router.get('/clear', function(req, res, next) {
    Diagnostic.deleteMany({},(err, data)=>{
        //If there is an error, return the error to response. Otherwise return the list of all users in JSON format.
        err ? res.status(401).json(err) : res.json(data);
    });
});

/** POST adds a diagnostic to the DB **/
router.post('/add', function(req, res){

    // Get JSON out of request, along with parameters
    console.log(req.body);
    let requestData = req.body;
    let gwID = requestData.gwID; // gateway ID
    let wtID = requestData.wtID; // wind turbine ID
    let timestamp = requestData.timestamp; // timestamp from gateway of when request was made
    let gearboxTemp = requestData.gearboxTemp; // temperature of turbine gearbox, provided by IoT device
    let rotorTemp = requestData.rotorTemp; // temperature of turbine rotor, provided by IoT device
    let rotorSpeed = requestData.rotorSpeed; // speed of turbine rotor, provided by IoT device
    let gridVoltage = requestData.gridVoltage; // total grid voltage, provided by IoT device
    let windSpeed = requestData.windSpeed; // wind speed, provided by IoT device

    if(process.env.NODE_ENV !== 'test'){
        console.log("Checking for errors in data.");

        if(gearboxTemp > 40){
            ws.send(JSON.stringify({
                    type:"error",
                    content: "Gearbox temperature is too high!"
                })
            );
        }

        if(rotorTemp > 40){
            ws.send(JSON.stringify({
                    type:"error",
                    content: "Rotor temperature is too high!"
                })
            );
        }

        if(rotorSpeed < 9){
            ws.send(JSON.stringify({
                    type:"error",
                    content: "Turbine speed is too slow! Powering off motor!"
                })
            );
        }

        if(rotorSpeed < 25 && rotorSpeed >= 9){
            ws.send(JSON.stringify({
                    type:"warning",
                    content: "Turbine speed is slow!"
                })
            );
        }

        if(rotorSpeed > 35 && rotorSpeed < 55){
            ws.send(JSON.stringify({
                    type:"error",
                    content: "Turbine speed is too fast!"
                })
            );
        }

        if (rotorSpeed >= 55){
            ws.send(JSON.stringify({
                    type:"error",
                    content: "Turbine speed critical! Shutting down turbine!"
                })
            );
        }
    }

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

    // Create a new diagnostic object with received data and current time.
    let newDiagnostic = new Diagnostic({
        gwID: gwID,
        wtID: wtID,
        sentTime: timestamp,
        receivedTime:
            {
                date: currDate,
                time: currTime
            },
        gearboxTemp: gearboxTemp,
        rotorTemp: rotorTemp,
        rotorSpeed: rotorSpeed,
        gridVoltage: gridVoltage,
        windSpeed: windSpeed
    });

    let scheduledDiagnosticList;

    ScheduledDiagnostic.find({}, (err, diagnostics) =>{
        //If there is an error, return the error to response. Otherwise return the list of all users in JSON format.
        if (err) {
            scheduledDiagnosticList = "NO SCHEDULED DIAGNOSTICS";
        }
        else {
            scheduledDiagnosticList = diagnostics;
        }
    });

    // Save the diagnostic in the diagnostics DB collection,
    // if there's an error, return status 401 with the error
    newDiagnostic.save((err, data)=>{
        err ? res.status(401).json(err) : res.json({data, scheduledDiagnosticList});
    });
});

/** POST adds a diagnostic to the DB **/
router.post('/addScheduled', function(req, res){

    // Get JSON out of request, along with parameters
    console.log(req.body);
    let requestData = req.body;
    let gwID = requestData.gwID; // gateway ID
    let wtID = requestData.wtID; // wind turbine ID
    let setTime = requestData.setTime; // scheduled time for diagnostics

    // Create a new diagnostic object with received data and current time.
    let newScheduledDiagnostic = new ScheduledDiagnostic({
        gwID: gwID,
        wtID: wtID,
        setTime: setTime
    });

    // Save the diagnostic in the diagnostics DB collection,
    // if there's an error, return status 401 with the error
    newScheduledDiagnostic.save((err, data)=>{
        err ? res.status(401).json(err) : res.json(data);
    });
});

// /** GET all entries from 8AM to 8PM from the given day **/
// router.get('/dailyDiagnostics', function(req, res, next) {
//    //currDate comes from the request query params, and is in the format XX/XX/XXX
//    const currDate = req.query.date;
//    console.log('currDate: ' + currDate);
//
//    let allDiagnostics = [];
//
//    Diagnostic.find((err, diagnostics) =>{
//        //If there is an error, return the error to response.
//        // Otherwise return the list of all diagnostics in JSON format.
//
//        if(diagnostics.length !== 0){
//            for(let i = 0; i<diagnostics.length; i++){
//                allDiagnostics.push(diagnostics[i]);
//            }
//
//            //This code block will sift through all DB entries and check:
//            //(1) If the date of the entry matches the requested date.
//            //(2) If the time of the entry was between 8AM to 8PM.
//
//            let valid = [];
//
//            for (let i = 0; i < allDiagnostics.length; i++) {
//
//                console.log("at entry " + i + " entry: " + allDiagnostics[i]);
//
//                if(allDiagnostics[i].receivedTime.date === currDate){
//
//                    if((allDiagnostics[i].receivedTime.time) > '08:00' && allDiagnostics[i].receivedTime.time < '20:00')
//                    {
//                        console.log('Valid: ' + allDiagnostics[i].date + " " + allDiagnostics[i].time);
//                        valid.push(allDiagnostics[i]);
//                    }
//
//                    else
//                        {
//                            console.log('Not Valid: ' + allDiagnostics[i].receivedTime.date + " " +
//                                allDiagnostics[i].receivedTime.time);
//                        }
//                }
//
//                else{
//                    console.log('Not Valid: ' + allDiagnostics[i].receivedTime.date + " " +
//                        allDiagnostics[i].receivedTime.time);
//                }
//            }
//            console.log(valid);
//            if(valid.length === 0){
//                res.json(valid + "No diagnostics from 8AM to 8PM");
//            }
//            else{
//                res.json(valid);
//            }
//        }
//        else {
//            res.status(401).json("No entries in DB to pull from!");
//        }
//    });
// });

module.exports = router;