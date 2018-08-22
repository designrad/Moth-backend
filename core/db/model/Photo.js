'use strict';

let mongoose = require('mongoose');

let PhotoSchema = mongoose.Schema({
  name: { type: String },
  device: { type: String },
  accuracy: { type: Number },
  comments: { type: String },
  review: { type: String },
  latitude: { type: String },
  longitude: { type: String },
  identification: { type: String },
  date: { type: Date },
  author: { type: String },
  team: { type: String },
  email: { type: String }
});

module.exports = mongoose.model('Photo', PhotoSchema);
