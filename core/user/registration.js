'use strict';

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

let model = require('../db/model'),
    API = require('../APILib');

module.exports = async((req, res) => {
    let mail = req.body.mail,
        password = req.body.password;

    if(!mail || !password) return API.fail(res, API.errors.MISSED_FIELD);

    mail = mail.toLowerCase();
    let user = await(model.User.findOne({mail: mail}).exec());
    if(user) return API.fail(res, API.errors.USER_EXIST);

    let newUser = new model.User({
        mail: mail,
        password: password,
        date: Date.now(),
        firstTime: true,
        verification: false
    });
    
    let newVerification = new model.Verification({
        user: newUser._id,
        code: utils.generateRandomString(5)
    });
    newVerification = await(newVerification.save());
    utils.sendMessage(newVerification.code, mail, true);
    
    let location = new model.Location({
        user: newUser._id
    });
    location = await(location.save());
    newUser.location = location._id;
    newUser = await(newUser.save());

    let session = new model.UserSession({
        user: newUser._id
    });
    session = await(session.save());

    return API.success(res, {
        _id: newUser._id,
        mail: newUser.mail,
        firstTime: newUser.firstTime,
        session: session._id,
        verification: newUser.verification
    })
});