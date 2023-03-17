const express = require('express');

const authController = require('../controllers/auth');
const authValidator = require('../validators/auth-validator');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',authValidator.validateLogin, authController.postLogin);

router.post('/signup',authValidator.validateSignup, authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;