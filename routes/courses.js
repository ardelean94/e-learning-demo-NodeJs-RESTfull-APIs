const auth = require('../middleware/auth');
const { Course, validate } = require('../models/course');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();

//GET   /api/courses
router.get('/', async (req, res) => {
   const courses = await Course.find().sort('name');
   res.send(courses);
});

//POST /api/courses
router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const category = await Category.findById(req.body.categoryId);
    if(!category) return res.status(400).send('Invalid category');

    const course = new Course ({ 
        title: req.body.title,
        category: {
            _id: category._id,
            //isAvailable: category.isAvailable,
            name: category.name,
            //code: category.code
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    await course.save();

    res.send(course);
});

//PUT /api/courses/:id
router.put('/:id', auth, async (req, res) => {
   const { error } = validate(req.body);
   if (error) return res.status(400).send(error.details[0].message);

   const course = await Course.findByIdAndUpdate(
       req.params.id,
       {
           title: req.body.title,
           numberInStock: req.body.numberInStock,
           dailyRentalRate: req.body.dailyRentalRate
       },
       { new: true }
   );

   if(!course) return res.status(404).send('The course with the given ID was not found.');

   res.send(course);
});

//DELETE /api/courses/:id
router.delete('/:id', auth, async (req, res) => {
    const course = await Course.findByIdAndRemove(req.params.id);

    if(!course) return res.status(404).send('The course with the given ID was not found.');
    
    res.send(course);
});

//GET /api/courses/:id
router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id);

    if(!course) return res.status(404).send('The course with the given ID was not found');

    res.send(course);
});

module.exports = router;