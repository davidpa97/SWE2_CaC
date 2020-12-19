/**
 * Command in Control Turbine Schema File
 * Maintained by: David Padilla-Arenivar
 * Boilerplate by: David Padilla-Arenivar
 *   This file contains the schema that serves as the basis for storing all turbines.
 *   There is currently only one turbine, so the entry is pre-defined by us, but ideally
 *   would be setup by an asset manager in a real-world system.
 *   wtID is a number that can identify the turbine.
 *   gwID is the ID of the gateway linked to the turbine, which is set in the initial POST request.
 *   Lat is the latitude of the turbine.
 *   Long is the longitude of the turbine.
 **/

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Define the schema
let turbineSchema = new Schema({
    wtID: {
        type:Number,
        required: true,
        trim: true,
        length: 8
    },
    lat: {
        type:Number,
        required: true,
        trim: true
    },
    long: {
        type:Number,
        required: true,
        trim: true
    },
    gwID: {
        type:Number,
        required: false,
        trim: true
    }

});

//Register the schema with mongoose
let Turbine = mongoose.model('Turbine', turbineSchema);
