'use strict';

let async = require('asyncawait/async'),
  await = require('asyncawait/await'),
  fs = require('fs');

let API = require('../APILib'),
  path = require('../path'),
  utils = require('../utils');

module.exports = async((req, res) => {
  let fileName = req.body.filename,
    p = path.PUBLIC.ARCHIVES + '/images.zip';

  if (fileName == 'geolocations.txt') {
    p = path.PUBLIC.GEOLOCATIONS + `/${fileName}`;
  }

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

