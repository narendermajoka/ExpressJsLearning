const { body } = require('express-validator/check');
const User = require('../models/user');

exports.validateLogin = [
    body('email')
        .isEmail()
        .withMessage('Please enter valid email')
        .normalizeEmail({ gmail_remove_dots: false }), //removes whitespace and lowercase the value
    body('password', 'Password length must be greater than 5 chars and Alphanumeric')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim()
];

exports.validateSignup = [
    body('email')
        .isEmail()
        .withMessage('Please enter valid email')
        .custom((emailId) => {
            return User.findOne({ email: emailId }).then(user => {
                if (user) {
                    return Promise.reject('Email already exists, please pick different one.');
                }
            });
        })
        .normalizeEmail({ gmail_remove_dots: false }), //removes whitespace and lowercase the value
    body('password', 'Password length must be greater than 5 chars and Alphanumeric')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim(),
    body('confirmPassword')
        .trim()
        .custom((confirmPassword, {req}) => {
             if (confirmPassword !== req.body.password) {
                return Promise.reject('Password must match');
            }
            return true; //must return true if no sync code above
        })    
];