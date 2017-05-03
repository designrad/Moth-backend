'use strict';

let async = require('asyncawait/async'),
  await = require('asyncawait/await'),
  moment = require('moment');

let model = require('../db/model'),
  API = require('../APILib'),
  CONST = require('../constants');

module.exports = async((req, res) => {
  let file;
  let device = req.body.device,
    accuracy = req.body.accuracy,
    comments = req.body.comments ? req.body.comments : '',
    latitude = req.body.latitude,
    longitude = req.body.longitude,
    author = req.body.author ? req.body.author : '',
    team = req.body.team ? req.body.team : '',
    email = req.body.email ? req.body.email : '',
    date = req.body.date;

  if (req.files) {
    file = req.files.file;
  } else return API.fail(res, "No file photo")

  if (!file || !accuracy || !latitude || !longitude || !device) { return API.fail(res, "Not all data is filled out") }
  let path = file.path.split('/');
  let fileName = path[path.length - 1];

  let newPhoto = new model.Photo({
    name: fileName,
    device,
    accuracy,
    comments,
    latitude,
    longitude,
    identification: CONST.identificationPhoto.UNCERTAIN.name,
    date: date ? new Date(date) : new Date(),
    author,
    team,
    email
  });


  newPhoto = await(newPhoto.save());

  return API.success(res, {
    photo: newPhoto
  })
});