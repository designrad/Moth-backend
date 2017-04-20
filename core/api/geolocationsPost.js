'use strict';

let async = require('asyncawait/async'),
  await = require('asyncawait/await'),
  jsonFile = require('jsonfile'),
  moment = require('moment'),
  fs = require('fs');

let model = require('../db/model'),
  API = require('../APILib'),
  path = require('../path'),
  utils = require('../utils'),
  CONST = require('../constants');

module.exports = async((req, res) => {
  let dataSession = req.session.data;

  if (dataSession && dataSession.session && dataSession.userId) {
    let session = await(model.Session.findOne({admin: dataSession.userId}).exec());
    if (session.session != dataSession.session) { return API.fail(res, API.errors.UNAUTHORIZED) }
  } else {
    return API.fail(res, API.errors.UNAUTHORIZED)
  }

  const images = await(model.Photo.find().exec()),
    fileName = CONST.filesName.geolocations;

  if (fs.existsSync(path.PUBLIC.GEOLOCATIONS + `/${fileName}`)) {
    await(fs.unlink(path.PUBLIC.GEOLOCATIONS + `/${fileName}`));
  }

  let geolocationsJson = {};
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    geolocationsJson[image.name] = {
      id: image._id,
      name: image.name,
      comments: image.comments,
      latitude: image.latitude,
      longitude: image.longitude,
      identification: image.identification,
      date: moment(image.date).format("DD.MM.YYYYY HH:mm:ss")
    }
  }

  await(jsonFile.writeFile(path.PUBLIC.GEOLOCATIONS + `/${fileName}`, geolocationsJson, function (err) {
    console.error(err);
    if (err) return API.fail(res, err);
  }));

  return API.success(res, {
    fileName
  });
});
