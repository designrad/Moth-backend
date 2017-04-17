'use strict';
let multipart = require('connect-multiparty');

let admin = require('./admin'),
    path = require('./path'),
    image = require('./image'),
    api = require('./api');

module.exports = (srv, express) => {
    srv.get('/', admin.panel);
    srv.get('/fullscreen', admin.fullscreen);
    srv.get('/login', admin.login);
    srv.get('/reg', admin.reg);
    srv.get('/logout', admin.logout);
    srv.post('/signIn', admin.signIn);
    srv.post('/signUp', admin.signUp);
    srv.post('/check', admin.sessionCheck);
    srv.post('/image/purge-deleted', image.purgeDeleted)

    //image
    srv.post('/image/upload', multipart({ uploadDir: path.PUBLIC.MOTH_PICTURES }), image.upload);
    srv.post('/image/delete', image.delete);
    srv.use('/image', express.static(path.PUBLIC.MOTH_PICTURES));

    //assets
    srv.use('/assets/css', express.static(path.PUBLIC.STYLE));
    srv.use('/assets/js', express.static(path.PUBLIC.JS));
    srv.use('/assets/libs', express.static(path.PUBLIC.LIBS));
    srv.use('/assets/img', express.static(path.PUBLIC.IMG));

    //api
    srv.post('/image/update', api.photoUpdate);
    srv.post('/image/archive', api.archive);
    srv.post('/image', api.image);
};