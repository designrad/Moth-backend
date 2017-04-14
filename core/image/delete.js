'use strict';
let async = require('asyncawait/async'),
  await = require('asyncawait/await'),
  fs = require('fs');

let model = require('../db/model'),
  API = require('../APILib'),
  CONST = require('../constants'),
  path = require('../path');

module.exports = async((req, res) => {
  let dataSession = req.session.data,
    filename = req.body.filename;

  if (dataSession && dataSession.session && dataSession.userId) {
    let session = await(model.Session.findOne({admin: dataSession.userId}).exec());
    if (session.session != dataSession.session) { return API.fail(res, API.errors.ACCESS_DENIED); }
  } else {
    return API.fail(res, API.errors.ACCESS_DENIED);
  }

  if (!filename) return API.fail(res, API.errors.NOT_FOUND);
  let image = await(model.Photo.findOne({name: filename}).exec());

  fs.unlink(path.PUBLIC.MOTH_PICTURES + `/${filename}`, async((err) => {
    if (err) {
      if (err.code == 'ENOENT') if (image) { await(image.remove()); }
      return API.fail(res, API.errors.NOT_FOUND);
    }

    if (image) { await(image.remove()); }
    return API.success(res, {
      filename: filename,
      state: 'deleted'
    })
  }));
});