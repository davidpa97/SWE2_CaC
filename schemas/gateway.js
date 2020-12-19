/**
 * Command in Control Gateway Schema File
 * Maintained by: David Padilla-Arenivar
 * Boilerplate by: David Padilla-Arenivar
 *   This file contains the schema that serves as the basis for storing all gateways.
 *   gwID is currently set manually by the asset manager in the initial POST request.
 *   Array of Turbines[] is set to include an array of turbineIDs that are linked
 *   to the gateway in question.
 **/

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Define the schema
let gatewaySchema = new Schema({
    gwID: {
        type:Number,
        required: true,
        trim: true,
        length: 6
    },
    name: {
        type:String,
        required: true,
        unique: true,
        trim: true
    },
    manager: {
        type:String,
        required: true,
        trim: true
    },
    turbines: {
        type:[Number],
        required: false,
        trim: true
    }

});

//Register the schema with mongoose
let Gateway = mongoose.model('Gateway', gatewaySchema);
