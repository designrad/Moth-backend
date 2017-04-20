'use strict';

let async = require('asyncawait/async'),
  await = require('asyncawait/await'),
  fs = require('fs');

let API = require('../APILib'),
  path = require('../path'),
  utils = require('../utils'),
  CONST = require('../constants');

module.exports = async((req, res) => {
  let fileName = req.body.filename,
    p = path.PUBLIC.ARCHIVES + `/${CONST.filesName.images}`;

  if (fileName == CONST.filesName.geolocations) {
    p = path.PUBLIC.GEOLOCATIONS + `/${fileName}`;
  }

  //check file
  if (fs.existsSync(p)) {
    return API.success(res, {
      completed: true
    });
  } else {
    return API.success(res, {
      completed: false
    });
  }
});

