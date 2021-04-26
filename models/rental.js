const Joi = require('joi');
const mongoose = require('mongoose');
const {courseSchema} = require('./course');

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({ //instead of reusing the schema which can be huge we decided to create a new one here
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            },
            isGold:{
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            }
        }),
        required: true
    },
    course: {
        type: courseSchema,
        required: true
    },
    dateOut:{
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

const Rental = new mongoose.model('Rental', rentalSchema);

function validateRental(rental){
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        courseId: Joi.objectId().required()
    });

    return schema.validate(rental);
}

module.exports.validate = validateRental;
module.exports.Rental = Rental;