'use strict';

let async = require('asyncawait/async'),
  await = require('asyncawait/await'),
  zip = new require('node-zip')(),
  fs = require('fs');

let model = require('../db/model'),
  API = require('../APILib'),
  path = require('../path'),
  utils = require('../utils'),
  CONST = require('../constants');

module.exports = async((req, res) => {
  let dataSession = req.session.data;

  //check session
  if (dataSession && dataSession.session && dataSession.userId) {
    let session = await(model.Session.findOne({admin: dataSession.userId}).exec());
    if (session.session != dataSession.session) { return API.fail(res, API.errors.UNAUTHORIZED) }
  } else {
    return API.fail(res, API.errors.UNAUTHORIZED)
  }

  //get all images for archive
  let images = await(model.Photo.find().exec());
  const fileName = CONST.filesName.images;

  //check archive and delete
  if (fs.existsSync(path.PUBLIC.GEOLOCATIONS + `/${fileName}`)) {
    fs.unlink(path.PUBLIC.GEOLOCATIONS + `/${fileName}`);
  }

  //add image in archive
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    zip.file(image.name, fs.readFileSync(path.PUBLIC.MOTH_PICTURES + `/${image.name}`), {base64: true});
  }

  //generate archive with new images
  let data = zip.generate({ base64: false, compression: 'DEFLATE' });

  //write archive
  await(fs.writeFile(path.PUBLIC.ARCHIVES + `/${fileName}`, data, 'binary', (err) => {
    if (err) {
      console.error(err)
    }
  }));

  return API.success(res, {
    fileName
  });
});