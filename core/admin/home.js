'use strict';

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

let model = require('../db/model'),
    API = require('../APILib'),
    CONST = require('../constants');

module.exports = async((req, res) => {
    let page = req.param('page');
    if (!page) page = 1;
    let dataSession = req.session.data;
    if (!dataSession || !dataSession.session || !dataSession.userId) {
        return res.redirect('/login');
    }

    let session = await(model.Session.findOne({session: dataSession.session}).exec());
    if (!session || session && session.admin != dataSession.userId) {
        return res.redirect('/login');
    } else {
      await(session.save());
    }

    const count = await(model.Photo.count());
    let images = await(model.Photo.find().sort({"date": -1}).skip((page - 1) * CONST.limits.records).limit(CONST.limits.records).exec());

    return res.render('admin/index', {
        template: 'home',
        title: "Admin panel",
        images,
        numberPage: page,
        countPage: Math.ceil(count / CONST.limits.records),
        identifications: CONST.identificationPhoto
    });
});
