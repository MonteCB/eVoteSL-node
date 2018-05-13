const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const VoterSchema = mongoose.Schema({
    name: {
        type: String
    },
    nic: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    isVoted: {
        type: Boolean,
        required: true

    }

});

const Voter = module.exports = mongoose.model('Voter', VoterSchema);

module.exports.addVoter = function (newUser, callback) {
    newUser.save(callback);
}

module.exports.getVoterByNic = function (nic, callback) {
    const query = {nic: nic}
    Voter.findOne(query, callback);

}


module.exports.getVoterById = function (id, callback) {
    Voter.findById(id, callback);
}