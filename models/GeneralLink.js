const mongoose = require('mongoose');
const { Schema } = mongoose;

const generalLinkSchema = new Schema({
    connectionId: String,
    source: Number,
    target: Number,
    weight: Number,
    sourceId: Number,
    targetId: Number
});

// No need to link this to mongoose model here as we are importing this as a sub doc collection in GeneralNetwork
module.exports = generalLinkSchema; 