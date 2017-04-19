'use strict';
var path = require('path');
var BASE_PATH = path.dirname(process.mainModule.filename);
module.exports = {
    PUBLIC: {
      MOTH_PICTURES: BASE_PATH + '/public/moth_pictures',
      ARCHIVES: BASE_PATH + '/public/archives',
      GEOLOCATIONS: BASE_PATH + '/public/geolocations',
      STYLE: BASE_PATH + '/assets/css',
      JS: BASE_PATH + '/assets/js',
      LIBS: BASE_PATH + '/assets/libs',
      IMG: BASE_PATH + '/assets/images'
    }
};
