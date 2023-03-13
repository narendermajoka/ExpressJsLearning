const path = require('path');
const rootPath = require('../utils/path');
const fs = require('fs');

const jsonPath = path.join(rootPath, 'data', 'cart.json');

module.exports = class Cart {

    static addProduct(id, productPrice){
        fs.readFile(jsonPath, (err,fileContent)=>{
            let cart = {products : [], totalPrice : 0};
            if(!err){
                cart = JSON.parse(fileContent);
            }
            const existingProductIdx = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIdx];
            let updatedProduct;
            if(existingProduct){
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty + 1;
                // cart.products = [...cart.products];
                cart.products[existingProductIdx] = updatedProduct;
            }else{
                updatedProduct = {id: id, qty: 1};
                cart.products.push(updatedProduct);
                //cart.products = [...cart.products], updatedProduct};
            }
            cart.totalPrice = parseFloat(cart.totalPrice + parseFloat(productPrice));
            fs.writeFile(jsonPath,JSON.stringify(cart), err=>{
                console.log(err);
            });
        }
    )};

    static deleteProductById(id,productPrice){
        fs.readFile(jsonPath, (err,fileContent)=>{
            if(err)
                return;
            let cart = JSON.parse(fileContent);
            const updatedCart = {...cart};
            
            const product = cart.products.find(prod=> prod.id === id);
            if(!product)
                return;

            updatedCart.products = updatedCart.products.filter(prod=> prod.id !== id);
            updatedCart.totalPrice = updatedCart.totalPrice - productPrice * product.qty;
            fs.writeFile(jsonPath,JSON.stringify(updatedCart), err=>{
                console.log(err);
            });
        });

    }

    static getCart(cb){
        fs.readFile(jsonPath, (err,fileContent)=>{
                if(err){
                    cb(null);
                }else{
                    let cart = JSON.parse(fileContent);
                    cb(cart);
                }
        });
    }

}