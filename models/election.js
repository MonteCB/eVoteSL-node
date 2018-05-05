const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//user schema
const ElectionSchema = mongoose.Schema({
    name: {
        type: String
    },
    started: {
        type: Boolean,
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

const Election = module.exports = mongoose.model('Election', ElectionSchema);

