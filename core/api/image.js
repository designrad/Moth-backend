'use strict';

let async = require('asyncawait/async'),
  await = require('asyncawait/await');

let model = require('../db/model'),
  API = require('../APILib');

module.exports = async((req, res) => {
  let id = req.body.id,
    filename = req.body.filename,
    photo;

  try {
    if (id) {
      photo = await(model.Photo.findOne({_id: id}).exec());
    } else if (filename) {
      photo = await(model.Photo.findOne({name: filename}).exec());
    }
  } catch (e) {
    return API.fail(res, e)
  }

  if (!photo) { return API.fail(res, "photo not found") }

  return API.success(res, {
    image: photo
  });
});
