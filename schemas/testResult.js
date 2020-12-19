/**
 * Command in Control Test Results Schema File
 * Maintained by: David Padilla-Arenivar
 * Boilerplate by: David Padilla-Arenivar
 *   This file contains the schema that serves as the basis for storing all test results.
 *   gwID, sentTime, and all test results are values that come from the Gateway in a POST request.
 **/

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Define the schema
let testResultSchema = new Schema({
    gwID: {
        type:Number,
        required: true,
        trim: true,
        length: 6
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
    cpuIntResult: {
        type: String,
        required: true
    },
    cpuPrimeResult: {
        type: String,
        required: true
    },
    cpuFloatResult: {
        type: String,
        required: true
    },
    storageResult: {
        type: String,
        required: true
    },
    memoryResult: {
        type: String,
        required: true
    }


});

//Register the schema with mongoose
let TestResult = mongoose.model('TestResult', testResultSchema);
