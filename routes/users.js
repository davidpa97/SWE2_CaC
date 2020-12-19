/**
 * Command in Control Users API File
 * Maintained by: David Padilla-Arenivar
 * Boilerplate by: David Padilla-Arenivar
 *   This file houses the CiC User Management API, which allows for the storing and verification of user login data from
 *   the shared database. Currently, the information involved only relates to pre-populated users, which contain basic
 *   user login information.
 **/

// Import and initialize Express
const express = require('express');
const router = express.Router();

// Import and setup salt rounds for bcrypt (password hashing)
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Import and initialize Mongoose and User Schema
let mongoose = require('mongoose');
require("../schemas/user");
let User = mongoose.model('User');

/** GET users listing on /users/ **/
router.get('/', function(req, res, next) {
    //Search for all users, and return a callback.
    User.find({}, (err, users) =>{
        //If there is an error, return the error to response. Otherwise return the list of all users in JSON format.
        err ? res.status(401).json(err) : res.json(users);
    });
});

/** GET users listing on /users/ **/
router.get('/clear', function(req, res, next) {
    User.deleteMany({},(err, data)=>{
        //If there is an error, return the error to response. Otherwise return the list of all users in JSON format.
        err ? res.status(401).json(err) : res.json(data);
    });
});

// Add user to MongoDB
router.post('/add', function(req, res){

    // Get JSON out of request, along with parameters
    console.log(req.body);
    let requestData = req.body;
    let username = requestData.username;
    let email = requestData.email;
    let submittedPassword = requestData.password;

    let hashedPassword = '';
    console.log(req.body);
    if(req.body !== undefined && typeof submittedPassword === 'string'){
        // Hash the password before proceeding to save the user info
        bcrypt
            .genSalt(saltRounds)
            .then(salt => {
                console.log(`Salt: ${salt}`);
                return bcrypt.hash(submittedPassword, salt);
            })
            .then(hash => {
                console.log(`Hash: ${hash}`);
                hashedPassword = hash;
                console.log(hashedPassword);
                // Create a new user object with received data.
                let newUser = new User({
                    username: username,
                    email: email,
                    password: hashedPassword
                });

                // Save the user in the users DB collection,
                // if there's an error, return status 401 with the error
                newUser.save((err, data)=>{
                    err ? res.status(401).json(err) : res.json(data);
                });
            });
    }
    else{
        res.status(401).json("Password is not a string!");
    }
});

/** POST Verify user based on login credentials stored in DB **/
router.post('/login', function(req, res){

    // Get JSON out of request, along with parameters
    console.log(req.body);
    let requestData = req.body;
    let username = requestData.username;
    let submittedPassword = requestData.password;

    User.findOne({username:username}, function(err, result){
        if(err) throw err;
        console.log(result.username);

        let userPasswordHash = result.password;

        // Compares hashed password to hash of submitted password, in order to verify the hash is good to save to the DB.
        // Returns a response of 'false' if the hashes are different, 'true' if they match.
        bcrypt
            .compare(''+submittedPassword, ''+userPasswordHash)
            .then(result => {
                if(result === true){
                    res.send({loginSuccessful:true});
                }
                else {
                    res.send({loginSuccessful:false});
                }
            })
            .catch(err => console.error(err.message));
    });
});

module.exports = router;
