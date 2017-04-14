'use strict';

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

let model = require('../db/model'),
    API = require('../APILib'),
    utils = require('../utils');

module.exports = async((req, res) => {

    let username = req.body.username,
        password = req.body.password;

    if (!username || !password) return res.redirect('/login');
    let admin = await(model.Admin.findOne({username: username}).select('+password').exec());
    if(!admin) return res.redirect('/login');

    admin.comparePassword(password, async((error, isMatch) => {
        if (error) { return res.redirect('/login') }
        if (!isMatch) { return res.redirect('/login') }

        await(model.Session.remove({admin: admin._id}).exec());

        let session = new model.Session({
          admin: admin._id,
          session: utils.generateRandomString()
        });

        session = await(session.save());
        req.session.data = utils.changeSessionData(req.session, {
            session: session.session,
            username: admin.username,
            email: admin.email,
            userId: admin._id
        });
        return res.redirect('/')
    }));
});