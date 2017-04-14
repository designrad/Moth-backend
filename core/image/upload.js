'use strict';

let async = require('asyncawait/async'),
  await = require('asyncawait/await');

let model = require('../db/model'),
  API = require('../APILib'),
  CONST = require('../constants');

module.exports = async((req, res) => {
  let file = req.files.file,
    comments = req.body.comments,
    coordinates = req.body.coordinates

  let path = file.path.split('/');
  let fileName = path[path.length - 1];

  let newPhoto = new model.Photo({
    name: fileName,
    comments: comments,
    coordinates: coordinates,
    identification: CONST.identificationPhoto.UNCERTAIN.name,
    delete: false
  });


  newPhoto = await(newPhoto.save());

  return API.success(res, {
    _id: newPhoto._id,
    photoInf: newPhoto
  })
});