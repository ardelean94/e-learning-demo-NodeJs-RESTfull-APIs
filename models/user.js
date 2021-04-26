const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 5,
        max: 50
    },
    email: {
        type: String,
        unique: true,
        required: true,
        min: 5,
        max: 50
    },
    //for enforcing a more complex password, use: joi-password-complexity
    //for hasing pass use library: bcrypt
    password: {
        type: String,
        min: 5,
        max: 1024,
        required: true
    },
    isAdmin: Boolean
    // //for complex applications we may need to control the
    // //access at more granular level, then we can use:
    // ,roles: [],
    // operations: []
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
}

const User = new mongoose.model('User', userSchema);

function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(5).max(255).required()
    });

    return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;