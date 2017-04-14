'use strict';

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

let model = require('../db/model'),
    API = require('../APILib');

module.exports = async((req, res) => {

    let session = req.body.session;

    if (!session) return API.fail(res, API.errors.USER_NOT_FOUND);
    session = await(model.UserSession.findOne({_id: session}).populate({
        model: 'User',
        path: 'user',
        populate: {
            model: 'Location',
            path: 'location'
        }
    }).exec());
    if (session && session.user) {
        if(session.user.banned == true){
            let error = API.errors.ACCESS_DENIED;
            if(error.text.length < 15) {
                error.text = error.text + '\nReason: This account was banned';
            }
            return API.fail(res, error);
        }
        let user = await(session.user.save());
        API.success(res, {
            session: session._id,
            _id: user._id,
            name: user.name,
            mail: user.mail,
            phone: user.phone,
            info: user.info,
            location: user.location,
            date: user.date,
            icon: user.icon,
            banner: user.banner,
            banned: user.banned,
            firstTime: user.firstTime,
            verification: user.verification
        });
    } else {
        API.fail(res, API.errors.UNAUTHORIZED);
    }
});