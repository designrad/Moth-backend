'use strict';

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

let model = require('../db/model'),
    API = require('../APILib');

module.exports = async((req, res) => {

    let session = req.body.session;

    if (!session) return API.fail(res, API.errors.USER_NOT_FOUND);

    session = await(model.AdminSession.findOne({_id: session}).populate('admin').exec());
    if (session) {
        API.success(res, {
            session: session._id,
            _id: session.admin._id,
            name: session.admin.name,
            mail: session.admin.mail
        });
    } else {
        API.fail(res, API.errors.UNAUTHORIZED);
    }
}); 