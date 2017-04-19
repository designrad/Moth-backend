'use strict';

let async = require('asyncawait/async'),
  await = require('asyncawait/await'),
  fs = require('fs');

let model = require('../db/model'),
  API = require('../APILib'),
  CONST = require('../constants'),
  path = require('../path');

module.exports = async((req, res) => {
  let dataSession = req.session.data;

  if (dataSession && dataSession.session && dataSession.userId) {
    let session = await(model.Session.findOne({admin: dataSession.userId}).exec());
    if (session.session != dataSession.session) { return API.fail(res, API.errors.UNAUTHORIZED) }
  } else {
    return API.fail(res, API.errors.UNAUTHORIZED)
  }

  let images = await(model.Photo.find({ identification: CONST.identificationPhoto.DELETE.name })).map(function(item){ return {
    id: item._id,
    name: item.name
  }});

  for (let i = 0; i < images.length; i++){
    let image = images[i];
    console.log(image.id, image.name)
    if (fs.existsSync(path.PUBLIC.MOTH_PICTURES + `/${image.name}`)) {
      fs.unlink(path.PUBLIC.MOTH_PICTURES + `/${image.name}`, (err) => {});
    }
  }

  await(model.Photo.find({ identification: CONST.identificationPhoto.DELETE.name }).remove());

  return API.success(res, {images});
});
