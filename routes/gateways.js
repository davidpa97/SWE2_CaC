/**
 * Command in Control Gateways API File
 * Maintained by: David Padilla-Arenivar
 * Boilerplate by: David Padilla-Arenivar
 *   This file houses the CiC Gateway Management API, which allows for the storing and retrieving of data from the
 *   shared database as it pertains to Gateways. Currently, the only gateway in use will be pre-populated, but in
 *   the future we expect to be producing new Gateways via user input from a form filled out by an asset manager.
 *
 *   The functioning Gateway, which is split into the GW Controller and GW Diagnostics components, knows its own
 *   Gateway ID, so these functions are mainly for obtaining the list of turbines associated with a Gateway.
 **/


//Import and initialize Express
const express = require('express');
const router = express.Router();

//Import and initialize Mongoose and User Schema
let mongoose = require('mongoose');
require('../schemas/gateway');
let Gateway = mongoose.model('Gateway');

/** GET retrieve all gateway listings from the DB **/
router.get('/', function(req, res, next) {
    //Search for all gateways, and return a callback.
    Gateway.find({}, (err, gateways) =>{
        //If there is an error, return the error to response.
        // Otherwise return the list of all gateways in JSON format.
        err ? res.status(401).json(err) : res.json(gateways);
    });
});

/** GET clears DB of all gateways (for testing purposes) **/
router.get('/clear', function(req, res, next) {
    Gateway.deleteMany({},(err, data)=>{
        //If there is an error, return the error to response.
        // Otherwise return a JSON object listing how many entries were deleted (by default).
        err ? res.status(401).json(err) : res.json(data);
    });
});

/** POST adds a gateway to the DB **/
router.post('/add', function(req, res){
    console.log(req.body);
    let requestData = req.body;
    let name = requestData.name; // gateway name set by asset manager
    let manager = requestData.manager; // asset manager assigned to the gateway

    //Generate a random 6 digit number to use as the gwID
    const gwID = Math.floor(100000 + Math.random() * 900000);

    // Create a new gateway with the generated gwID.
    // The turbines for this gateway will be added after it is created using the /updateTurbineList endpoint.
    let newGateway = new Gateway({
        gwID: gwID,
        name: name,
        manager: manager
    });

    // Save the gateway in the gateways collection in the DB,
    // and if there's an error, it returns the error along with a
    // 401 status code.
    newGateway.save((err, data)=>{
        err ? res.status(401).json(err) : res.json(data);
    });
});

/** POST update list of turbines associated with a gateway based on its gwID **/
router.post('/updateTurbineList', function(req, res){
    //Get JSON out of request, along with parameters
    console.log(req.body);
    let requestData = req.body;
    let gwID = requestData.gwID;
    let turbines = requestData.turbines;

    //Search for document with gwID matching the one given in the request
    let query = { gwID: gwID };

    //Update value for 'turbines[]' to the one given in the request
    let newValue = { $push: { turbines: turbines }};

    //Find existing gateway, update turbines[] value with new turbine[] from the request
    //Return 401 error if a problem occurs
    Gateway.updateOne(query, newValue, function(err, data) {
        err ? res.status(401).json(err) : res.json(data);
        console.log("Gateway " + gwID + " turbine list updated.");
    });

});

/** GET retrieve a gateway listing from the DB based on the gwID **/
router.get('/gatewayInfo', function(req, res, next) {
    //Get JSON out of request, along with parameters
    console.log(req.query.gwID);
    let requestData = req.query;
    let gwID = requestData.gwID;

    Gateway.findOne({gwID:gwID}, (err, gateway) =>{
        //If there is an error, return the error to response.
        // Otherwise return the list of all gateways in JSON format.
        if(gateway != null){
            res.json(gateway);
        }
        else {
            res.status(401).json(err);
        }
    });
});

module.exports = router;