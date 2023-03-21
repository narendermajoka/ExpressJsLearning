const express = require('express');
const authValidator = require('../validators/auth-validator');
const authController = require('../controllers/auth');

const router = express.Router();

router.put('/signup', authValidator.signup, authController.signup);

router.post('/login', authController.login);
module.exports = router;