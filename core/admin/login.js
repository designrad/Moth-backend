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
        if (!session) {
            return res.redirect('/login');
        } else if (session.admin != dataSession.userId) {
            return res.redirect('/login');
        }

        //If the user is authorized
        return res.redirect('/');
    }

    res.render('auth/login', {title: "Login"});
});