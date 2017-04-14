'use strict';

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

let model = require('../db/model'),
    API = require('../APILib');

module.exports = async((req, res) => {
    let mail = req.body.mail,
        password = req.body.password;

    if (!mail || !password) return API.fail(res, API.errors.MISSED_FIELD);

    mail = mail.toLowerCase();
    let user = await(model.User.findOne({mail: mail}).populate('location').select('+password').exec());
    if (!user) return API.fail(res, API.errors.USER_NOT_FOUND);

    user.comparePassword(password, (error, isMatch) => {
        if (error) {
            return API.fail(res, API.errors.UNKNOWN);
        }

        if (!isMatch) {
            return API.fail(res, API.errors.USER_PASSWORD_NOT_MATCH);
        }

        let session = new model.UserSession({
            user: user._id
        });

        if(user.banned == false) {
            user.firstTime = utils.isUserFirstTime(user.mail, user.name, user.phone, user.location.text);
            if(!user.verification) {
                let newVerification = new model.Verification({
                    user: user._id,
                    code: utils.generateRandomString(5)
                });
                newVerification.save();
                utils.sendMessage(newVerification.code, mail, true);
            }
            user.save().then(_user => {
                session.save().then(session => {
                    return API.success(res, {
                        session: session._id,
                        mail: _user.mail,
                        _id: _user._id,
                        firstTime: _user.firstTime,
                        verification: _user.verification,
                        name: _user.name,
                        phone: _user.phone,
                        location: _user.location,
                        banned: _user.banned
                    });
                });
            });
        } else {
            let error = API.errors.ACCESS_DENIED;
            if(error.text.length < 15) {
                error.text = error.text + '\nReason: This account was banned';
            }
            return API.fail(res, error);
        }
    });
});