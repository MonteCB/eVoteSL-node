const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const BoothSchema = mongoose.Schema({
    booth_id: {
        type: String,
        required: true
    },
    poll_station: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    letVote: {
        type: Boolean,
        required:true
    },
    usertype: {
        type: String,
        required:true
    }
});

const Booth = module.exports = mongoose.model('Booth', BoothSchema);

//get booth by ID
module.exports.getBoothById = function (id, callback) {
    Booth.findById(id, callback);
}

//get user by name
module.exports.getBoothByBoothId = function (booth_id, callback) {
    const query = {booth_id: booth_id}
    Booth.findOne(query, callback);

}

//hashing the password with salt and bcrypt
module.exports.addBooth = function (newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.comparePassword = function (boothPassword, hash, callback) {
    bcrypt.compare(boothPassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}