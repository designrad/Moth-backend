'use strict';

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

let model = require('../db/model'),
    API = require('../APILib');

module.exports = async((req, res) => {
    let dataSession = req.session.data;
    //check session

    if (dataSession && dataSession.session && dataSession.userId) {
        let session = await(model.Session.findOne({session: dataSession.session}).exec());

        // If the user is authorized
        if (session && session.admin == dataSession.userId) {
          return res.redirect('/');
        }
    }

    res.render('auth/login', {title: "Login"});
});
