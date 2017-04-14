'use strict';

let async = require('asyncawait/async'),
  await = require('asyncawait/await');

let model = require('../db/model'),
  utils = require('../utils');

module.exports = async((req, res) => {
  let dataSession = req.session.data,
    session = null;

  if (dataSession) { session = await(model.Session.findOne({admin: dataSession.userId}).exec()); }

  if (session) { await(session.remove()); }

  req.session.data = utils.clearSessionData();
  res.redirect('/login')
});