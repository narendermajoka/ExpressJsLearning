const Product = require('../models/product');
const {validationResult} = require('express-validator/check');
const path = require('path');

const fileHelper = require('../utils/file-utility');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    errorMessage:''
  });
};

exports.getEditProduct = (req,res,next)=>{
  const editMode = req.query.editMode;
  const productId = req.params.productId;
  Product.findById(productId)
  .then(product=>{
    if(!product){
      console.log('Redirecting as product is undefined');
      res.redirect("/");
      return;
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
      errorMessage:''
    });
  }).catch(err=> next(new Error(err)));
 
};

exports.postAddProduct = (req, res, next) => {

  const title = req.body.title;
  // const imageUrl = req.body.imageUrl;
  const image = req.file; //this will contain file, if its permitted while configuring multer in app.js, else null
  const price = req.body.price;
  const description = req.body.description;
  console.log('uploaded image:');
  console.log(image);
  if(!image){
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      errorMessage: 'Please upload supported image'
    });
  }
  console.log('move ahead of throwing error for image');
  const imageUrl = path.normalize('/' + image.path);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      errorMessage: errors.array()[0].msg
    });
  }

  const product = new Product({
    title: title,
    imageUrl: imageUrl,
    description: description,
    price: price,
    userId: req.user._id
  });
  product.save().then(()=>{
    res.redirect('/admin/products');
  })
  .catch(err=>next(new Error(err)));
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const title = req.body.title;
  // const imageUrl = req.body.imageUrl;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true, 
      product: {
        title: title,
        price: price,
        description: description,
        _id: id
      },
      errorMessage: errors.array()[0].msg
    });
  }

  Product.findById(id).then(product=>{
    if(product.userId.toString() !== req.user._id.toString()){
      console.log('User not authorized for this product');
      return res.redirect('/');
    }
    product.title = title;
    if(image){
      fileHelper.deleteFile(product.imageUrl);
      product.imageUrl = path.normalize('/' + image.path);
    }
    product.price = price;
    product.description = description;
    return product.save().then((result)=>{
      res.redirect('/admin/products');
    });
  })
  .catch(err=> next(new Error(err)));
 
};

exports.postDeleteProduct= (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return next(new Error('Product not found.'));
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  
};

exports.getProducts = (req, res, next) => {
  Product.find({userId: req.user._id})
  // .select('title description -_id') //to fetch only some fields, add - infront if want to exclude
  // .populate('userId','name') //populate reference fields
  .then(products=>{
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  }).catch(err=> next(new Error(err)));  
};
