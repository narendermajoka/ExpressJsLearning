const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { validationResult } = require('express-validator');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('data validation failed!');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                name: name
            });
            return user.save();
        })
        .then(user => {
            return res.status(201).json({ message: 'User created', userId: user._id });
        })
        .catch(err => next(err));
};

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email);
    let loggedInUser;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error('Email not registered');
                error.statusCode = 401;
                throw error;
            }
            loggedInUser = user;
            return bcrypt.compare(password, user.password);
                
        })
        .then((equal) => {
            if (!equal) {
                const error = new Error('Wrong password');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({
                email: loggedInUser.email,
                userId: loggedInUser._id
            }, 'somesupersecretlongsecret', { expiresIn: '1h' });
            res.status(200).json({ token: token, userId: loggedInUser._id.toString() });
        }).catch(err => {
            next(err);
        });
}