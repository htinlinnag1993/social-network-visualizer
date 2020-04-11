const mongoose = require('mongoose');
const { Schema } = mongoose;
const GeneralNodeSchema = require('./GeneralNode');
const GeneralLinkSchema = require('./GeneralLink');

const generalNetworkSchema = new Schema({
    name: String,
    description: String,
    nodes: [GeneralNodeSchema], // Sub document collection. Imported from GeneralNodeSchema.
    links: [GeneralLinkSchema], // Sub document collection. Imported from GeneralLinkSchema.
    lastUpdated: Date,
    createdOn: Date,
    _user: { type: Schema.Types.ObjectId, ref: 'User'},
});

mongoose.model('general-networks', generalNetworkSchema);