'use strict';

let async = require('asyncawait/async'),
  await = require('asyncawait/await');

let model = require('../db/model'),
  API = require('../APILib');

module.exports = async((req, res) => {
  //get all photos for mobile
  const photos = await(model.Photo.find().exec());

  return API.success(res, {
    photos
  });
});

