/**
 * Command in Control User Schema File
 * Maintained by: David Padilla-Arenivar
 * Boilerplate by: David Padilla-Arenivar
 *   This file contains the schema that serves as the basis for storing all users.
 *   username, email, and password are all values that come from the frontend in a POST request.
 **/

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Define the schema
let userSchema = new Schema({
    username: {
        type:String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type:String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

//Register the schema with mongoose
let User = mongoose.model('User', userSchema);
