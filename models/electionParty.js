const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//user schema
const PartySchema = mongoose.Schema({
    party_name: {
        type: String,
        required: true
    },
    party_id: {
        type: Number,
        required: true
    },
    party: {
        type: String,
        required: true
    },
    votes: {
        type: Number,
        required: true
    }
});

const Party = module.exports = mongoose.model('Party', PartySchema);


module.exports.addCandidate = function (newUser, callback) {
    newUser.save(callback);
}