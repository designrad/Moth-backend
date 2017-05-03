'use strict';

let async = require('asyncawait/async'),
  await = require('asyncawait/await');

let model = require('../db/model'),
  API = require('../APILib'),
  CONST = require('../constants');

module.exports = async((req, res) => {
  let dataSession = req.session.data;
  //check session
  if (dataSession && dataSession.session && dataSession.userId) {
      let session = await(model.Session.findOne({session: dataSession.session}).exec());
      if (!session || session && session.admin != dataSession.userId) {
          return res.redirect('/login');
      }
  } else {
    return res.redirect('/login');
  }

  let images = await(model.Photo.find().sort({"date": -1}).exec());

  res.render('admin/fullscreen', {
    title: "Fullscreen",
    images,
    identifications: CONST.identificationPhoto
  })
});