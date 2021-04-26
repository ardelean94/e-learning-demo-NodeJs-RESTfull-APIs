const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function() {
    mongoose.connect('mongodb://localhost/eLearning', { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }, )
        .then(() => console.log('Connected to MongoDB...'));
}