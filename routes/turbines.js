/**
 * Command in Control Gateways API File
 * Maintained by: David Padilla-Arenivar
 * Boilerplate by: David Padilla-Arenivar
 *   This file houses the CiC Gateway Management API, which allows for the storing and retrieving of data from the
 *   shared database as it pertains to Turbines. Currently, the only turbine in use will be pre-populated, but in
 *   the future we expect to be producing new turbines via user input from a form filled out by an asset manager.
 *
 *   The functioning turbine knows its own Turbine ID, so these functions are mainly for obtaining the
 *   gateway ID, lat, and long associated with a Turbine.
 **/


//Import and initialize Express
const express = require('express');
const router = express.Router();

//Import and initialize Mongoose and User Schema
let mongoose = require('mongoose');
require('../schemas/turbine');
let Turbine = mongoose.model('Turbine');

/** GET retrieve all turbine listings from the DB **/
router.get('/', function(req, res, next) {
    //Search for all turbines, and return a callback.
    Turbine.find({}, (err, turbines) =>{
        //If there is an error, return the error to response.
        // Otherwise return the list of all turbines in JSON format.
        err ? res.status(401).json(err) : res.json(turbines);
    });
});

/** GET clears DB of all turbines (for testing purposes) **/
router.get('/clear', function(req, res, next) {
    Turbine.deleteMany({},(err, data)=>{
        //If there is an error, return the error to response.
        // Otherwise return a JSON object listing how many entries were deleted (by default).
        err ? res.status(401).json(err) : res.json(data);
    });
});

/** POST adds a turbine to the DB **/
router.post('/add', function(req, res){
    //Get JSON out of request, along with parameters
    console.log(req.body);
    let requestData = req.body;
    let lat = requestData.lat;
    let long = requestData.long;

    //Generate a random 8 digit number to use as the wtID
    const wtID = Math.floor(10000000 + Math.random() * 90000000);

    // Create a new turbine with the generated wtID.
    // The turbines for this turbine will be added after it is created using the /updateTurbineList endpoint.
    let newTurbine = new Turbine({
        wtID: wtID,
        lat: lat,
        long:long
    });

    // Save the turbine in the turbines collection in the DB,
    // and if there's an error, it returns the error along with a
    // 401 status code.
    newTurbine.save((err, data)=>{
        err ? res.status(401).json(err) : res.json(data);
    });
});

/** POST update gateway ID associated with a turbine based on its wtID **/
router.post('/updateGatewayID', function(req, res){
    //Get JSON out of request, along with parameters
    console.log(req.body);
    let requestData = req.body;
    let wtID = requestData.wtID;
    let gwID = requestData.gwID;

    //Search for document with wtID matching the one given in the request
    let query = { wtID: wtID };

    //Update value for 'turbines[]' to the one given in the request
    let newValue = { $set: { gwID: gwID}};

    //Find existing turbine, update gwID value with new gwID from the request so the two can be linked
    //Return 401 error if a problem occurs
    Turbine.updateOne(query, newValue, function(err, data) {
        err ? res.status(401).json(err) : res.json(data);
        console.log("Turbine " + wtID + " gateway updated.");
    });

});

/** GET retrieve a turbine listing from the DB based on the wtID **/
router.get('/turbineInfo', function(req, res, next) {
    //Get JSON out of request, along with parameters
    console.log(req.query);
    let requestData = req.query;
    let wtID = requestData.wtID;

    Turbine.findOne({wtID:wtID}, (err, turbine) =>{
        //If there is an error, return the error to response.
        // Otherwise return the list of all turbines in JSON format.
        if(turbine != null){
            res.json(turbine);
        }
        else{
            res.status(401).json(err);
        }
        console.log(res.statusCode);
    });
});

module.exports = router;