/**
 * Command in Control Diagnostic Schema File
 * Maintained by: David Padilla-Arenivar
 * Boilerplate by: David Padilla-Arenivar
 *   This file contains the schema that serves as the basis for storing all diagnostics.
 *   gwID, sentTime, and turbineTemp are all values that come from the Gateway in a POST request.
 **/

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Define the schema
let diagnosticSchema = new Schema({
    gwID: {
        type:Number,
        required: true,
        trim: true,
        length: 6
    },
    wtID: {
        type:Number,
        required: true,
        trim: true,
        length: 8
    },
    sentTime: {
        type:String,
        required: true,
        trim: true
    },
    receivedTime: {
        type: {
            date: {
                type: String,
                required: true
            },
            time: {
                type: String,
                required: true
            }
        },
        required: true
    },
    gearboxTemp: {
        type: Number,
        required: true
    },
    rotorTemp: {
        type: Number,
        required: true
    },
    rotorSpeed: {
        type: Number,
        required: true
    },
    gridVoltage: {
        type: Number,
        required: true
    },
    windSpeed: {
        type: Number,
        required: true
    }
});

//Register the schema with mongoose
let Diagnostic = mongoose.model('Diagnostic', diagnosticSchema);
