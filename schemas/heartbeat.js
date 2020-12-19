/**
 * Command in Control Heartbeat Schema File
 * Maintained by: David Padilla-Arenivar
 * Boilerplate by: Jacob Beneski
 *   This file contains the schema that serves as the basis for storing all heartbeats.
 *   gwID, sentTime, deviceLat, and deviceLong are all values that come from the Gateway in a POST request.
 **/

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Define the schema
let heartbeatSchema = new Schema({
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
    }
});

//Register the schema with mongoose
let Heartbeat = mongoose.model('Heartbeat', heartbeatSchema);
