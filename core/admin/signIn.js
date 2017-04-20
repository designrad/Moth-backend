'use strict';

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

let model = require('../db/model'),
    API = require('../APILib'),
    utils = require('../utils');

module.exports = async((req, res) => {
    //get user data
    let username = req.body.username,
        password = req.body.password;

    let errors = {};
    //check username
    if (!username) {
        errors['username'] = "The field can not be empty";
    }
    //check password
    if (!password) {
      errors['password'] = "The field can not be empty";
    }
    if (errors.username || errors.password) return res.render('auth/login', {errors});
    //find user admin on database
    let admin = await(model.Admin.findOne({username: username}).select('+password').exec());
    if(!admin) return res.render('auth/login', {errors: {
        password: "Incorrect username or password"
    }});

    //check compare password
    admin.comparePassword(password, async((error, isMatch) => {
        if (error) { return res.redirect('/login') }
        if (!isMatch) { return res.redirect('/login') }

        await(model.Session.remove({admin: admin._id}).exec());

        let session = new model.Session({
          admin: admin._id,
          session: utils.generateRandomString()
        });

        //save session admin
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