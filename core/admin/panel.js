'use strict';

let async = require('asyncawait/async'),
  await = require('asyncawait/await');

let model = require('../db/model'),
  API = require('../APILib'),
  CONST = require('../constants');

module.exports = async((req, res) => {
  console.log('get panel');
  let dataSession = req.session.data;
  if (!dataSession || !dataSession.session || !dataSession.userId) { return res.redirect('/login') }

  let session = await(model.Session.findOne({admin: dataSession.userId}).exec());
  if (session.session != dataSession.session) { return res.redirect('/login') }

  let images = await(model.Photo.find().exec());

  console.log('images', images);
  return res.render('admin/index', {
    title: "Admin panel",
    images,
    identifications: CONST.identificationPhoto
  });
});