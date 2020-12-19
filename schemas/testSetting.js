/**
 * Command in Control Test Settings Schema File
 * Maintained by: David Padilla-Arenivar
 * Boilerplate by: David Padilla-Arenivar
 *   This file contains the schema that serves as the basis for storing all testing settings.
 *   gwID is the ID of the gateway running the tests, which is set up by the asset manager.
 *   startTime is the start time for all hardware tests.
 *   endTime is the end time at which hardware tests are no longer run.
 **/

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Define the schema
let testSettingSchema = new Schema({
    gwID: {
        type:Number,
        required: true,
        unique: true,
        trim: true,
        length: 6
    },
    startTime: {
        type:String,
        required: true,
        trim: true
    },
    endTime: {
        type:String,
        required: true,
        trim: true
    }

});

//Register the schema with mongoose
let TestSetting = mongoose.model('TestSetting', testSettingSchema);
