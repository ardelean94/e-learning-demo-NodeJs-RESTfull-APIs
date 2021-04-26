const express = require('express');
const customers = require('../routes/customers');
const categories = require('../routes/categories');
const courses = require('../routes/courses');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function(app) {
    //midleware
    app.use(express.json());
    //if we have a request for one of the below end points
    //we gonna delegate this to the according router
    app.use('/api/customers', customers);
    app.use('/api/categories', categories);
    app.use('/api/courses', courses);
    app.use('/api/rentals', rentals);
    app.use('/api/users', users);
    app.use('/api/auth', auth);

    //Express Error Middleware
    app.use(error);
}