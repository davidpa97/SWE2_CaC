/**
 * Command in Control Software Links API File
 * Maintained by: David Padilla-Arenivar
 * Boilerplate by: Jacob Beneski
 *   This file houses the software links API, which allows for the storing and retrieving of software package
 *   download links. The data is then used by the frontend to display a 'library' of software to download.
 **/

// Import and initialize Express
var express = require('express');
var router = express.Router();

// Import and initialize Mongoose and Heartbeat Schema
let mongoose = require('mongoose');
require('../schemas/softwareLink');
let SoftwareLink = mongoose.model('SoftwareLink');

/** GET all software link listings in the DB **/
router.get('/', function(req, res, next) {
  // Search for all software links, and return a callback.
  SoftwareLink.find({}, (err, links) =>{
    // If there is an error, return the error to response.
    // Otherwise return the list of all heartbeats in JSON format.
    err ? res.status(401).json(err) : res.json(links);
  });
});

/** GET clear all software links from the DB (for testing purposes) **/
router.get('/clear', function(req, res, next) {
  SoftwareLink.deleteMany({},(err, data)=>{
    // If there is an error, return the error to response.
    // Otherwise return a JSON object listing how many entries were deleted (by default).
    err ? res.status(401).json(err) : res.json(data);
  });
});

/** POST Add software link to the softwareLinks collection in the Mongo DB **/
router.post('/add', function(req, res){

  // Get JSON out of request, along with parameters
  console.log(req.body);
  let requestData = req.body;
  let title = requestData.title; // Software package title
  let link = requestData.link; // Link to the software package
  let description = requestData.description; // Description of software package

  // Create a new heartbeat object with received data and current time.
  let newSoftwareLink = new SoftwareLink({
    title: title,
    link: link,
    description: description
  });

  // Save the software package link in the softwareLinks collection in the DB,
  // and if there's an error, it returns the error along with a
  // 401 status code.
  newSoftwareLink.save((err, data)=>{
    err ? res.status(401).json(err) : res.json(data);
  });
});

module.exports = router;
