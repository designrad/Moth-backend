'use strict';

let async = require('asyncawait/async'),
  await = require('asyncawait/await'),
  zip = new require('node-zip')(),
  fs = require('fs');

let model = require('../db/model'),
  API = require('../APILib'),
  path = require('../path'),
  utils = require('../utils');

module.exports = async((req, res) => {
  let dataSession = req.session.data;

  if (dataSession && dataSession.session && dataSession.userId) {
    let session = await(model.Session.findOne({admin: dataSession.userId}).exec());
    if (session.session != dataSession.session) { return API.fail(res, API.errors.UNAUTHORIZED) }
  } else {
    return API.fail(res, API.errors.UNAUTHORIZED)
  }

  let images = await(model.Photo.find().exec());
  const archiveName = `${utils.generateRandomString(20)}.zip`;

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    zip.file(image.name, fs.readFileSync(path.PUBLIC.MOTH_PICTURES + `/${image.name}`), {base64: true});
  }

  let data = zip.generate({ base64: false, compression: 'DEFLATE' });

  fs.writeFile(path.PUBLIC.ARCHIVES + `/${archiveName}`, data, 'binary');

  return API.success(res, {
    archiveName
  });
});