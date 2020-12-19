/**
 * Command in Control Scheduled Diagnostic Schema File
 * Maintained by: David Padilla-Arenivar
 * Boilerplate by: David Padilla-Arenivar
 *   This file contains the schema that serves as the basis for storing all diagnostics.
 *   gwID, setTime come from the Frontend in a POST request.
 **/

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Define the schema
let scheduledDiagnosticSchema = new Schema({
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
    setTime: {
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
let ScheduledDiagnostic = mongoose.model('ScheduledDiagnostic', scheduledDiagnosticSchema);
