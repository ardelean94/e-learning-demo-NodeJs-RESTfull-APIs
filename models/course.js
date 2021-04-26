const Joi = require('joi');
const mongoose = require('mongoose');
const {categorySchema} = require('./category');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    category:{
        type: categorySchema,
        default: false
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
});

const Course = mongoose.model('Course', courseSchema);

function validateCourse(course){
    const schema = Joi.object({
        title: Joi.string().min(5).max(50).required(),
        categoryId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required(),
    });

    return schema.validate(course);
}

module.exports.Course = Course;
module.exports.validate = validateCourse;
module.exports.courseSchema = courseSchema;