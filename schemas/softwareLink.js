/**
 * Command in Control Software Download Link Schema File
 * Maintained by: David Padilla-Arenivar
 * Boilerplate by: Jacob Beneski
 *   This file contains the schema that serves as the basis for storing all software download links.
 *   Title, Link, and Description all are coming from a manual entry via Postman currently.
 **/

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Define the schema
let softwareLinkSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    link: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    }
});

//Register the schema with mongoose
let SoftwareLink = mongoose.model('SoftwareLink', softwareLinkSchema);
