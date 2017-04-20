'use strict';

let async = require('asyncawait/async'),
  await = require('asyncawait/await');

let model = require('../db/model'),
  API = require('../APILib'),
  CONST = require('../constants');

module.exports = async((req, res) => {
  let page = req.param('page');
  if (!page) page = 1;
  let dataSession = req.session.data;
  if (!dataSession || !dataSession.session || !dataSession.userId) { return res.redirect('/login') }

  let session = await(model.Session.findOne({admin: dataSession.userId}).exec());
  if (session.session != dataSession.session) { return res.redirect('/login') }

  const count = await(model.Photo.count());
  let images = await(model.Photo.find().skip((page - 1) * 10).limit(10).exec());

  return res.render('admin/index', {
    template: 'home',
    title: "Admin panel",
    images,
    numberPage: page,
    countPage: Math.ceil(count / 10),
    identifications: CONST.identificationPhoto
  });
});