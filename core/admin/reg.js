'use strict';

let async = require('asyncawait/async'),
  await = require('asyncawait/await');

let model = require('../db/model'),
  API = require('../APILib');

module.exports = async((req, res) => {
  console.log('get reg')
  let dataSession = req.session.data;
  if (dataSession && dataSession.session && dataSession.userId) {
    let session = await(model.Session.findOne({admin: dataSession.userId}).exec());
    if (session.session != dataSession.session) { return res.redirect('/login') }
    return res.redirect('/')
  }

  res.render('auth/reg', {
    title: "Registration"
  })
});
