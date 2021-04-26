const auth = require('../middleware/auth');
const { Rental, validate} = require('../models/rental');
const { Course, courseSchema } = require('../models/course');
const { Customer } = require('../models/customer');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);

//GET /api/rentals
router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

//POST /api/rentals
router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('Invalid customer');

    const course = await Course.findById(req.body.courseId);
    if(!course) return res.status(400).send('Invalid course');

    if(course.numberInStock === 0) return res.status(400).send('The requested course is not available');

    let rental = new Rental ({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        course: {
            _id: course._id,
            title: course.title,
            dailyRentalRate: course.dailyRentalRate
        }
    });

    /*Here we have 2 saves mothod and if the first one
    crashes the data can become dummy, so we need
    the concent of tranzaction: either both succeed or none 
    PACKAGE that simulates tranzaction in mongoose: fawn*/

    // //Instead of these 3 lines we gonna implement a task
    // rental = await rental.save();
    // course.numberInStock--;
    // rental.save();

    try{
        new Fawn.Task()
            .save('rentals', rental)
            .update('courses', { _id: course._id},{
                $inc: { numberInStock: -1 }
            })
            .run();
    }
    catch(ex){
        res.status(500).send('Something failed.');
    }
    
    res.send(rental);
});

module.exports = router;