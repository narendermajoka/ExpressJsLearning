const Product = require('../models/product');
const Cart = require('../models/cart');
// const path = require('path');
// const rootDir = require('../utils/path');


exports.getProducts = (req, res, next) => {

  //res.sendFile('/views/shop.html'); //this path will not work as it will search in root of operating system
    // res.sendFile(path.join(__dirname,'..','views','shop.html')); //__dirname is global var that have current directory's path
     //we need to go back by using .. as views is not under routes directory

    // const products = Product.fetchAll();
    // res.render('shop',
    // {pageTitle: 'My Shop',prods: products, activeShop: true}
    // );

  /* Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  }); */

  /* Product.fetchAll()
  .then(([rows,fieldData])=>{
    res.render('shop/product-list', {
      prods: rows,
      pageTitle: 'All Products',
      path: '/products'
    });
  })
  .catch((err)=>{
      console.log(err);
  }); */

  Product.findAll().then( products =>{
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  }).catch((err)=>{
    console.log(err);
  });

};

exports.getProduct = (req,res,next) =>{
    const productId = req.params.productId;
  /* to get from file 
    Product.findById(productId, product=>{
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    }); */
   
    /* //using native sql way  
   Product.findById(productId)
    .then(([rows])=>{
      console.log(rows);
      const product = rows[0];
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    }).catch(err=> console.log(err)); */

    //using sequelize
   
/* Alternative approach
    Product.findAll({where : { id: productId} }).then(rows=>{
      let product = rows[0];
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    }).catch(err=> console.log(err));  */

      Product.findByPk(productId).then(product=>{
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    }).catch(err=> console.log(err));

};

exports.getIndex = (req, res, next) => {
 /*  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  }); */
 /*  Product.fetchAll()
  .then(([rows,fieldData])=>{
    res.render('shop/index', {
      prods: rows,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch((err)=>{
    console.log(err);
  }); */
  Product.findAll().then( products =>{
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch((err)=>{
    console.log(err);
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          prod => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    });
  });
};

exports.postCart = (req,res,next)=>{
    const productId = req.body.productId;
    Product.findById(productId, product=>{
        Cart.addProduct(productId,product.price);
    });
    res.redirect("/cart");
};


exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.deleteProductById(prodId, product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
