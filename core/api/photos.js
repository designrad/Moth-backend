'use strict';

let async = require('asyncawait/async'),
  await = require('asyncawait/await');

let model = require('../db/model'),
  API = require('../APILib');

module.exports = async((req, res) => {
  let device = req.body.device;

  let photos = [];
  if (device) {
    photos = await(model.Photo.find({device}))
  }

  //get photos by device
  if (photos.length) {
    photos = photos.map(function (photo) {
      return {
        id: photo._id,
        identification: photo.identification,
        date: photo.date,
        comments: photo.comments
      }
    });
  }

  return API.success(res, {photos});
});
