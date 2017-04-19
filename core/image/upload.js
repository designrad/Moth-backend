'use strict';

let async = require('asyncawait/async'),
  await = require('asyncawait/await');

let model = require('../db/model'),
  API = require('../APILib'),
  CONST = require('../constants');

module.exports = async((req, res) => {
  let file = req.files.file,
    device = req.body.device,
    accuracy = req.body.accuracy,
    comments = req.body.comments,
    coordinates = req.body.coordinates,
    author = req.body.author ? req.body.author : '',
    team = req.body.team ? req.body.team : '',
    email = req.body.email ? req.body.email : '';

  if (!file || !accuracy || !comments || !coordinates || !device) { return API.fail(res, "Not all data is filled out") }
  let path = file.path.split('/');
  let fileName = path[path.length - 1];

  let newPhoto = new model.Photo({
    name: fileName,
    device,
    accuracy,
    comments,
    coordinates,
    identification: CONST.identificationPhoto.UNCERTAIN.name,
    date: new Date(),
    author,
    team,
    email
  });


  newPhoto = await(newPhoto.save());

  return API.success(res, {
    photo: newPhoto
  })
});