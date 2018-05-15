const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const PartySchema = mongoose.Schema({
    party_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    votes: {
        type: Number,
        required: true
    }
});

const Party = module.exports = mongoose.model('Party', PartySchema);

//get booth by ID
module.exports.getPartyById = function (id, callback) {
    Party.findById(id, callback);
}

//get user by name
module.exports.getPartyByPartyId = function (party_id, callback) {
    const query = {party_id: party_id}
    Party.findOne(query, callback);

}

module.exports.addParty = function (newUser, callback) {
    newUser.save(callback);
}

module.exports.getPartyByName = function (name, callback) {
    const query = {name: name}
    Party.findOne(query, callback);

}



