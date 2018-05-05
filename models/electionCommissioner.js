const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
// const uniqueValidator = require('mongoose-unique-validator');

//user schema
const ElectionCommissionerSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
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
    }
});

const ElectionCom = module.exports = mongoose.model('ElectionCom', ElectionCommissionerSchema);


//get user by ID
module.exports.getUserById = function (id, callback) {
    ElectionCom.findById(id, callback);
}

//get user by name
module.exports.getUserByUsername = function (username, callback) {
    const query = {username: username}
    ElectionCom.findOne(query, callback);

}

//hashing the password with salt and bcrypt
module.exports.addEc = function (newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}