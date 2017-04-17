'use strict';

let async = require('asyncawait/async'),
  await = require('asyncawait/await');

let model = require('../db/model'),
  API = require('../APILib');

module.exports = async((req, res) => {
  let dataSession = req.session.data;

  if (dataSession && dataSession.session && dataSession.userId) {
    let session = await(model.Session.findOne({admin: dataSession.userId}).exec());
    if (session.session != dataSession.session) { return API.fail(res, API.errors.UNAUTHORIZED) }
  } else {
    return API.fail(res, API.errors.UNAUTHORIZED)
  }

  let idsDeleted = await(model.Photo.find({isDelete: true})).map(function(item){ return item._id });
  await(model.Photo.find({isDelete: true}).remove());

  return API.success(res, {idsDeleted});
});
