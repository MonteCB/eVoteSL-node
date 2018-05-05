const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//user schema
const CandidateSchema = mongoose.Schema({
    name: {
        type: String
    },
    nic: {
        type: String,
        required: true
    },
    party: {
        type: String,
        required: true
    },
    candidate_no: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    votes: {
        type: Number,
        required: true
    }
});

const Candidate = module.exports = mongoose.model('Candidate', CandidateSchema);


module.exports.addCandidate = function (newUser, callback) {
    newUser.save(callback);
}

module.exports.getCandidateByNic = function (nic, callback) {
    const query = {nic: nic}
    Candidate.findOne(query, callback);

}
module.exports.getCandidateByNum = function (candidate_no, callback) {
    const query = {candidate_no: candidate_no}
    Candidate.findOne(query, callback);

}