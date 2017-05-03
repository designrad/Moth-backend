'use strict';

let async = require('asyncawait/async'),
  await = require('asyncawait/await');

let model = require('../db/model'),
  utils = require('../utils');

module.exports = async((req, res) => {
  let dataSession = req.session.data,
    session = null;

  //get session admin
  if (dataSession) { session = await(model.Session.findOne({session: dataSession.session}).exec()); }

  //delete session
  if (session) { await(session.remove()); }

  //clear user session
  req.session.data = utils.clearSessionData();
  res.redirect('/login')
});