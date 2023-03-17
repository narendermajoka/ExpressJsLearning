
const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth'); 
const adminValidator = require('../validators/admin-validator');

const router = express.Router();

router.get('/add-product',isAuth, adminController.getAddProduct);

router.get('/edit-product/:productId',isAuth, adminController.getEditProduct);

router.get('/products', isAuth,adminController.getProducts);

router.post('/add-product',isAuth,adminValidator.validateAddProduct, adminController.postAddProduct);

router.post('/edit-product',isAuth,adminValidator.validateEditProduct, adminController.postEditProduct);

router.post('/delete-product',isAuth, adminController.postDeleteProduct);


module.exports = router;
