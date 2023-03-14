const Product = require('../models/product');

// const path = require('path');
// const rootDir = require('../utils/path');


exports.getAddProduct = (req, res, next) => {

   // console.log('In add product middleware');
    // res.send('<form action="/admin/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');

    // res.sendFile(path.join(__dirname,'..','views','add-product.html'));
   // res.sendFile(path.join(rootDir,'views','add-product.html'));

  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
};

exports.getEditProduct = (req,res,next)=>{
  const editMode = req.query.editMode;
  const productId = req.params.productId;
 /*  Product.findById(productId,product=>{
    if(!product){
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
      activeAddProduct: true
    });
  }); */
  Product.findByPk(productId)
  .then(product=>{
    if(!product){
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
      activeAddProduct: true
    });
  }).catch(err=> console.log(err));
 
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  
  /*
   product.save();
   res.redirect('/admin/products');
  */ 
 /* const product = new Product(null, title, imageUrl, description, price); 
   product.save()
  .then(()=> {
    res.redirect('/admin/products');
  })
  .catch((err)=> console.log(err)); */
  //Sequelize way to create new product in DB
  Product.create({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user.id
  })
  .then(result=>{
    res.redirect('/admin/products');
    //console.log(result)
})
  .catch(err=> console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
/*   const product = new Product(id, title, imageUrl, description, price);
  product.update(); */
  Product.findByPk(id)
    .then(product=>{
      product.id = id;
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;
      return product.save(); //sequelize provides save method which gives promise
    })
    .then(result=>{
      console.log("Updated Product");
      res.redirect('/admin/products');
    }).catch(err=>{
      console.log(err);
    })
 
};

exports.postDeleteProduct= (req, res, next) => {
  const id = req.body.productId;
  /* Product.deleteById(id);
  res.redirect('/admin/products'); */

  Product.findByPk(id)
  .then(product=>{
    return product.destroy(); //sequelize's inbuild method
  })
  .then(result=> {console.log("Product deleted"); res.redirect('/admin/products')})
  .catch(err=> console.log(err));
};

exports.getProducts = (req, res, next) => {
 /*  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }); */

 /*  Product.fetchAll()
  .then(([rows,fieldData])=>{
    res.render('admin/products', {
      prods: rows,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err=> console.log(err)); */

 /* one way to get all products using sequelize  
  Product.findAll()
  .then(products=>{
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err=> console.log(err));  */

  //to get products for logged in user, req.user is being set in app.js
  req.user.getProducts()
  .then(products=>{
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err=> console.log(err)); 
};
