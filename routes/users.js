const auth = require('../middleware/auth');
const config = require('config');
const jwt = require('jsonwebtoken');
const brypt = require('bcrypt');
const _ = require('lodash');    //by convention we use _
const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
    const user = await User
        .findById(req.user._id)
        .select('-password');
    
    res.send(user);
});

//POST /api/users
router.post('/', async(req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).send('User already registered.');

    //equivalent with "Solution 2"
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await brypt.genSalt(10);
    user.password = await brypt.hash(user.password, salt);

    // //Solution 2
    // user = new User ({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password
    // });
    await user.save();

    //To not return the whole data back to the user (res.send(user);)
    //we can send a custom object:
    /*
    res.send({
        name: user.name,
        email: user.email
    });
    OR we can use a library: Lodash
    */
    //res.send(user);

    const token = user.generateAuthToken();
    //any custom headers we prefix them with "x-"
    res.header('x-auth-token', token).send(_.pick(user, ['_id','name', 'email']));
});

module.exports = router;