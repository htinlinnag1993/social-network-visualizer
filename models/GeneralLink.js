const mongoose = require('mongoose');
const { Schema } = mongoose;

const generalLinkSchema = new Schema({
    connectionID: String,
    source: Number,
    target: Number,
    weight: Number,
    // Instead of having the following two fields, 
    // we will make use of network.startingNodeID to dynamically assign them
    // sourceID: Number,
    // targetID: Number
});

// No need to link this to mongoose model here as we are importing this as a sub doc collection in GeneralNetwork
module.exports = generalLinkSchema; 