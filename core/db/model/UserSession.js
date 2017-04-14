'use strict';

let mongoose = require('mongoose');

let UserSessionSchema = mongoose.Schema({
    user: {type: mongoose.Schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('UserSession', UserSessionSchema);