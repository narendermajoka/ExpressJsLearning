const Product = require('../models/product');
const {validationResult} = require('express-validator/check'); 

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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      errorMessage: errors.array()[0].msg
    });
  }

  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
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
  const imageUrl = req.body.imageUrl;
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
        imageUrl: imageUrl,
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
    product.imageUrl = imageUrl;
    product.price = price;
    product.description = description;
    return product.save().then((result)=>{
      res.redirect('/admin/products');
    });
  })
  .catch(err=> next(new Error(err)));
 
};

exports.postDeleteProduct= (req, res, next) => {
  const id = req.body.productId;
  Product.deleteOne({_id: id, userId: req.user._id})
  .then(()=>{
    res.redirect('/admin/products');
  }).catch(err=> next(new Error(err)));
  
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
