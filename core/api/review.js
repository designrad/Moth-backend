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
    if (!session || (session && session.admin != dataSession.userId)) {
      console.log('review unauth 1', session, dataSession.userId);
      return API.fail(res, API.errors.UNAUTHORIZED);
    }
  } else {
    console.log('review unauth 2', dataSession.userId);
    return API.fail(res, API.errors.UNAUTHORIZED)
  }

  //get data of body
  let filename = req.body.filename,
      data = req.body;

  //update photo
  let photo = await(model.Photo.findOne({name: filename}).exec());
  if (photo) {
    if (data.review) photo.review = data.review;
    await (photo.save());
  }

  return API.success(res, {
    image: photo,
    review: data,
  });
});
