'use strict';

let async = require('asyncawait/async'),
  await = require('asyncawait/await');

let model = require('../db/model'),
  API = require('../APILib');

module.exports = async((req, res) => {
  let dataSession = req.session.data,
    filename = req.body.filename,
    identification = req.body.identification;

  if (dataSession && dataSession.session && dataSession.userId) {
    let session = await(model.Session.findOne({admin: dataSession.userId}).exec());
    if (session.session != dataSession.session) { return API.fail(res, API.errors.UNAUTHORIZED) }
  } else {
    return API.fail(res, API.errors.UNAUTHORIZED)
  }

  // identificationUpdate
  let photo = await(model.Photo.findOne({name: filename}).exec());
  if (photo) {
    photo.identification = identification;
    await (photo.save());
  }

  return API.success(res, {
    image: photo
  });
});