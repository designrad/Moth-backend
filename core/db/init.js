'use strict';

var mongoose = require('mongoose');

mongoose.Promise = Promise;

var mongoLib = {
    connection: null,
    connected: false,
    init: null,
    isConnected: null
};

var MongooseInit = function (onError, onSuccess) {

    if (typeof onSuccess == 'undefined') {
        onSuccess = onError;
        onError = undefined;
    }

    mongoLib.connection = mongoose.connection;

    mongoLib.connection.close();

    mongoLib.connection.on('error', function () {
        console.log(arguments);
    });

    mongoLib.connection.once('open', function () {
        mongoLib.connected = true;
    });
    
    let DBHost = 'localhost';//localhost
    let DBName = 'admin';//admin
    let DBUserName = 'admin';//admin
    let DBPassword = 'sdf*(^Rbt89p8wns9psd';//sdf*(^Rbt89p8wns9psd

    let connectURL = `mongodb://${DBUserName}:${DBPassword}@${DBHost}:27017/${DBName}`;

    if(global.isDebug) {
        DBHost = 'localhost';
        DBName = 'mothDB';

        connectURL = `mongodb://${DBHost}:27017/${DBName}`;
    }
    
    mongoose.connect(connectURL, err => {
        if (err) {
            if (typeof onError == 'function') {
                onError(err);
            }
            mongoLib.connection.close();
            return null;
        }
        if (typeof onSuccess == 'function') {
            onSuccess.call();
        }
    });
};

mongoLib.init = MongooseInit;

var isConnected = function () {
    if (!mongoLib.connected) {
        console.error("Error! No MongoDB connection.");
        return false;
    }

    return true;
};

mongoLib.isConnected = isConnected;

module.exports = mongoLib;