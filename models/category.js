const Joi = require('joi');
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    code: {
        type: String,
        required: false,
        minlength: 2,
        maxlength: 50
    },
    isAvailable:{
        type: Boolean,
        default: false
    }
});

const Category = mongoose.model('Category', categorySchema);

function validateCategory(category){
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        code: Joi.string().min(2).max(50).required(),
        isAvailable: Joi.boolean()
    });

    return schema.validate(category);
}

module.exports.categorySchema = categorySchema;
module.exports.Category = Category;
exports.validate = validateCategory;