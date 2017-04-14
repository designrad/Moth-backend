'use strict';

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

let model = require('../db/model'),
    API = require('../APILib');

module.exports = async((io) => {
    io.on('connection', function(socket){
        console.log('a user connected');

        socket.on('disconnect', function(){
            console.log('user disconnected');
        });
    });
});