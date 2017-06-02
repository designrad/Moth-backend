'use strict';
let multipart = require('connect-multiparty');

let admin = require('./admin'),
    path = require('./path'),
    image = require('./image'),
    api = require('./api');

module.exports = (srv, express) => {
    srv.get('/', admin.home);
    srv.get('/fullscreen', admin.fullscreen);
    srv.get('/login', admin.login);
    srv.post('/login', admin.signIn);
    srv.get('/logout', admin.logout);
    srv.get('/map', admin.map);

    //image
    srv.post('/image/upload', multipart({ uploadDir: path.PUBLIC.MOTH_PICTURES }), image.upload);
    srv.post('/image/purge-deleted', image.purgeDeleted);
    //assets
    srv.use('/assets/css', express.static(path.PUBLIC.STYLE));
    srv.use('/assets/js', express.static(path.PUBLIC.JS));
    srv.use('/assets/libs', express.static(path.PUBLIC.LIBS));
    srv.use('/assets/img', express.static(path.PUBLIC.IMG));
    srv.use('/image', express.static(path.PUBLIC.MOTH_PICTURES));
    srv.use('/archive/download', express.static(path.PUBLIC.ARCHIVES));
    srv.use('/geolocations/download', express.static(path.PUBLIC.GEOLOCATIONS))

    //api
    srv.post('/image/update', api.photoUpdate);
    srv.post('/image/archive', api.archive);
    srv.post('/image', api.image);
    srv.post('/photos', api.photos);
    srv.get('/geolocations', api.geolocationsGet);
    srv.post('/geolocations', api.geolocationsPost);
    srv.post('/check-file', api.checkFile);
};