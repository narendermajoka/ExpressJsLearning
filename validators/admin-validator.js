const { body } = require('express-validator/check');

exports.validateAddProduct = [
    body('title', 'title must be more than 3 keywords')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    //body('imageUrl').isURL().withMessage('image must be an url'),
    body('price').isFloat().withMessage('price must be float value'),
    body('description', 'description must be more than 5 keywords and less than 400 words')
      .isLength({ min: 5, max: 400 })
      .trim()
];

exports.validateEditProduct = [
    body('title', 'title must be more than 3 keywords')
    .isString()
    .isLength({ min: 3 })
    .trim(),
  //body('imageUrl').isURL().withMessage('image must be an url'),
  body('price').isFloat().withMessage('price must be float value'),
  body('description', 'description must be more than 5 keywords and less than 400 words')
    .isLength({ min: 5, max: 400 })
    .trim()
];