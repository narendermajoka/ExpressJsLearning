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
 /*  Cart.getCart(cart => {
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
  }); */

  //Get cart for logged in user
  req.user.getCart()
  .then(cart=>{
    return cart.getProducts().then(products=>{
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });

    }).catch(err=> console.log(err));
  }).catch(err=> console.log(err));
};

exports.postCart = (req,res,next)=>{
    const productId = req.body.productId;
  /*   Product.findById(productId, product=>{
        Cart.addProduct(productId,product.price);
    }); */
    let fetchedCart;
    let newQuantity =  1;
    req.user.getCart()
    .then(cart=>{
      fetchedCart = cart;
      return cart.getProducts( { where : { id: productId }});
    })
    .then(products=>{
        let product;
        if(products.length>0){
          product  =products[0];
        }

        if(product){//if product is already in cart
          const oldQuantity = product.cartItem.quantity;
          newQuantity = oldQuantity+1;
          return product;
        }else{
          return Product.findByPk(productId); //get product from all products table
        } 
    }).then((product)=>{
      fetchedCart.addProduct(product, { through: { quantity: newQuantity} });
      res.redirect("/cart");
    })
    .catch(err=> console.log(err));
   
};


exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  /* Product.findById(prodId, product => {
    Cart.deleteProductById(prodId, product.price);
    res.redirect('/cart');
  }); */
  req.user.getCart()
  .then(cart=>{
    return cart.getProducts( { where : { id : prodId}});
  }).then(products=>{
    const product = products[0];
    return product.cartItem.destroy(); //delete only from cartItem not actual product
  })
  .then(()=> res.redirect('/cart'))
  .catch(err=> console.log(err));
};

exports.postOrder = (req,res,next)=>{
  let fetchedCart;
  req.user.getCart()
  .then(cart=>{
    fetchedCart = cart;
    return cart.getProducts(); 
  })
  .then(products=>{
    return req.user.createOrder()
    .then(order=>{
       return order.addProducts(products.map(product=>{
        product.orderItem = {quantity: product.cartItem.quantity}; // copy the quantity of product in cart to product in order
        return product;
       }))
    }).catch(err=>{
      console.log(err);
    });
  })
  .then(result=> {
    fetchedCart.setProducts(null);
    res.redirect('/orders');
  })
  .catch(err=> console.log(err));

};

exports.getOrders = (req, res, next) => {
  req.user
  .getOrders({include: ['products']})
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  })
  .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
