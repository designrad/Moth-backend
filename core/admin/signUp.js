'use strict';

let async = require('asyncawait/async'),
  await = require('asyncawait/await');

let model = require('../db/model'),
  API = require('../APILib'),
  utils = require('../utils');

module.exports = async((req, res) => {
  let username = req.body.username,
    email = req.body.email,
    password = req.body.password,
    confirmPassword = req.body.confirmPassword;

  console.log(username, email, password, confirmPassword)

  if (!username || !email || !password || !email.length || !password.length) return res.redirect('/login');

  if (password != confirmPassword) return res.redirect('/login');
  let admin = await(model.Admin.findOne({username, email}).exec());
  if (admin) return res.redirect('/login');

  let newAdmin = new model.Admin({
    username,
    email,
    password
  });
  newAdmin = await(newAdmin.save());

  let sess = model.Session({
    admin: newAdmin._id,
    session: utils.generateRandomString()
  });
  sess = await (sess.save());

  req.session.data = utils.changeSessionData(req.session, {
    session: sess.session,
    username: newAdmin.username,
    email: newAdmin.email,
    userId: newAdmin._id
  });
  return res.redirect('/')
});