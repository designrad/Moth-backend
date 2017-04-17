'use strict';

let async = require('asyncawait/async'),
  await = require('asyncawait/await');

let model = require('../db/model'),
  API = require('../APILib'),
  CONST = require('../constants');

module.exports = async((req, res) => {
  let dataSession = req.session.data;
  if (dataSession && dataSession.session && dataSession.userId) {
    let session = await(model.Session.findOne({admin: dataSession.userId}).exec());
    if (session.session != dataSession.session) { return res.redirect('/login') }
  } else {
    return res.redirect('/login');
  }

  let images = await(model.Photo.find().exec());

  res.render('admin/fullscreen', {
    title: "Fullscreen",
    images,
    identifications: CONST.identificationPhoto
  })
});