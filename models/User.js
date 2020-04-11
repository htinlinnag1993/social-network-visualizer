const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    googleId: String,
    displayName: String,
    email: String,
    credits: { type: Number, default: 5},
});

mongoose.model('users', userSchema);