'use strict';

let mongoose = require('mongoose');

let PhotoSchema = mongoose.Schema({
  name: { type: String },
  comments: { type: String },
  coordinates: { type: String },
  identification: { type: String },
  isDelete: { type: Boolean },
  date: { type: Date }
});

module.exports = mongoose.model('Photo', PhotoSchema);