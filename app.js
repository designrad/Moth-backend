'use strict';

global.isDebug = true;

let timeStart = new Date,
  isLog = true,
  colors = require('colors'),
  isRestart = false;

let consoleError = console.error;
console.error = function () {
  let _arguments = [...arguments].map(arg => typeof arg == 'string' ? arg.red : JSON.stringify(arg).red);
  consoleError.call(this, ..._arguments);
};

let consoleInfo = console.info;
console.info = function () {
  let _arguments = [...arguments].map(arg => typeof arg == 'string' ? arg.blue : arg);
  consoleInfo.call(this, ..._arguments)
};

let consoleWarn = console.warn;
console.warn = function () {
  let _arguments = [...arguments].map(arg => typeof arg == 'string' ? arg.yellow : arg);
  consoleWarn.call(this, ..._arguments)
};

console.ok = function () {
  let _arguments = [...arguments].map(arg => typeof arg == 'string' ? arg.cyan : JSON.stringify(arg).cyan);
  console.log.call(this, ..._arguments);
};

isLog && console.log('[HC] Start server...');
isLog && console.time('[HC] Server ready! Time to up');

let express = require('express'),
  sio = require('socket.io'),
  bodyParser = require('body-parser'),
  fileUpload = require('express-fileupload'),
  mongoLib = require('./core/db/init.js'),
  session = require('express-session'),
  mkdirp = require('mkdirp'),
  fetch = require('node-fetch');

let path = require('./core/path'),
  model = require('./core/db/model'),
  API = require('./core/APILib'),
  routes = require('./core/routes'),
  // utils = require('./core/utils'),
  socket = require('./core/socket');

let srv = express();

let app = {
  express: srv,
  mongoLib
};

let ServerBootstrap = () => {

  if (isRestart) {
    timeStart = new Date;
  }

  isLog && console.log('[HC] Init database connection...');

  app.mongoLib.init(err => {
    isLog && console.error('[HC] Connect to DB failed: ', err);
    isLog && console.info('[HC] Trying to reconnect in 5 second... ');
    isRestart = true;
    setTimeout(ServerBootstrap, 5000);
  }, () => {

    isLog && console.log('[HC] Database connection ready.');
    srv.set('views', __dirname + '/views')
    srv.set('view engine', 'jade')

    srv.use(bodyParser.json({limit: '50mb'}));
    // app.use(express.cookieDecoder());
    // srv.use(express.session());

    srv.use(session({
      secret: 'secretept',
      resave: true,
      saveUninitialized: true
    }));
    srv.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
    // srv.use(fileUpload());

    isLog && console.log('[HC] Configure routes...');

    srv.all('*', (req, res, next) => {
      res.header("Access-Control-Allow-Origin", req.headers.origin);
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.header("Access-Control-Allow-Credentials", "true");
      next();
    });

    srv.all('*', (req, res, next) => {
      API.res = res;
      //noinspection JSPrimitiveTypeWrapperUsage
      res.API = API;
      next();
    });

    routes(srv, express);

    for (let key in path.PUBLIC) {
      if (path.PUBLIC.hasOwnProperty(key)) {
        mkdirp(path.PUBLIC[key], err => {
          if (err) console.error(err);
        });
      }
    }

    isLog && console.log('[HC] Routes ready.');

    isLog && console.log('[HC] Start facebook update feed process');

    isLog && console.log('[HC] Start listen port 3001...');
    var server = srv.listen(3001, () => {

      isLog && console.ok('[HC] Server ready! Time to up:', (new Date) - timeStart, 'ms');
    }).on('error', err => {
      isLog && console.error('[HC] Error listening port 3001: ', err);
      console.info('[HC] Restart in 5 seconds...');
      setTimeout(ServerBootstrap, 5000);
    });

    let io = sio(server);
    socket.auth(io);

    global.app = app;
  });

};

ServerBootstrap();