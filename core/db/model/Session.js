'use strict';

let mongoose = require('mongoose');

let SessionSchema = mongoose.Schema({
    admin: {type: mongoose.Schema.ObjectId, ref: 'Admin'},
    session: {type: String}
});

module.exports = mongoose.model('Session', SessionSchema);