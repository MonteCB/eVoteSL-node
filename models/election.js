const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//election schema
const ElectionSchema = mongoose.Schema({
    name: {
        type: String
    },
    started: {
        type: Boolean,
        required: true
    },
    stopped: {
        type: Boolean,
        required: true
    },
    paused: {
        type: Boolean,
        required: true
    },
    e_id: {
        type: String,
        required: true
    },
    new_election:{
        type:Boolean,
        required: true
    },
    can_release:{
        type:Boolean,
        required: true
    },
    rejected:{
        type:Number,
        required: true
    },
    total_votes:{
        type:Number,
        required: true
    }
    
});

const Election = module.exports = mongoose.model('Election', ElectionSchema);

module.exports.addel = function (newUser, callback) {
    newUser.save(callback);
}