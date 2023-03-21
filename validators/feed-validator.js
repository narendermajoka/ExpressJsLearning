const { body } = require('express-validator');

exports.createPost = [
    body('title').trim().isLength({min: 2}),
    body('content').trim().isLength({min: 2, max: 100})
];