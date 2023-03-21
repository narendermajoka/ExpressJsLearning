const { body } = require('express-validator');
const User = require('../models/user');

exports.signup = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please enter valid email')
        .custom((email) => {
            return User.findOne({ email: email })
                .then(user => {
                    if (user) {
                        return Promise.reject('Email already exists');
                    }
                })
        }),
    body('password').trim().isLength({ min: 2, max: 100 })
    //  body('name').trim().isEmpty()

];