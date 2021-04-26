const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function() {
    //handling uncaught exceptions (winston catches errors that happen as part of request pipeline, particular to express)
    process.on('uncaughtException', (ex) => {
        //console.log('We got an uncaught exception');
        winston.error(ex.message, ex);
        process.exit(1);
    });

    //handling async (promise)
    process.on('unhandledRejection', (ex) => {
        //console.log('We got an unhandled rejection');
        winston.error(ex.message, ex);
        process.exit(1);
    });

    winston.add(new winston.transports.File({
        filename: 'logfile.log'
    }));
    winston.add(new winston.transports.MongoDB({
        db: 'mongodb://localhost/eLearning',
        level: 'error'  //or info, warn, verbose, debug, silly
    }));
}