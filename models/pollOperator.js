const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//user schema
const PollOperatorSchema = mongoose.Schema({
    name: {
        type: String
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    usertype: {
        type: String,
        required: true
    },
    poll_station: {
        type: String,
        required: true
    }

    
});

const PollOperator = module.exports = mongoose.model('PollOperators', PollOperatorSchema );

module.exports.getUserById = function (id, callback) {
    PollOperator.findById(id, callback);
}

//get user by name
module.exports.getUserByUsername = function (username, callback) {
    const query = {username: username}
    PollOperator.findOne(query, callback);

}

//hashing the password with salt and bcrypt
module.exports.addPo = function (newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.comparePassword = function (password, hash, callback) {
    bcrypt.compare(password, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}