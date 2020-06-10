const mongoose = require('mongoose');
const { Schema } = mongoose;

const generalNodeSchema = new Schema({
    nodeID: Number,
    name: String,
    descrition: String,
    // avatar: Buffer,
    // dob: Date,
    // email: String,
    // phone: Number,
    // streetAddress: String,
    // city: String,
    // zipCode: Number,
    // country: String,
    // homeIP: String,
    // company: String,
    // jobTitle: String,
    // influence: Number,
    // zone: Number
});

// No need to link this to mongoose model here as we are importing this as a sub doc collection in GeneralNetwork
module.exports = generalNodeSchema;