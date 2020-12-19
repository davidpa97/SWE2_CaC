/**
 * Command in Control Heartbeat Settings Schema File
 * Maintained by: David Padilla-Arenivar
 * Boilerplate by: David Padilla-Arenivar
 *   This file contains the schema that contains information that pertains to the settings for managing heartbeat
 *   frequency.
 *   All key values are defined by the asset manager and sent in via a POST request.
 **/

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Define the schema
let heartbeatSettingSchema = new Schema({
    gwID: {
        type:Number,
        required: true,
        trim: true,
        unique: true,
        length: 6
    },
    hbFrequency: {
        type: Number,
        required: false,
        default: 30
        //default of 30 secs
    }
});

//Register the schema with mongoose
let HeartbeatSetting = mongoose.model('HeartbeatSetting', heartbeatSettingSchema);
