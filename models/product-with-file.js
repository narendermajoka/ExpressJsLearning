
const products = [];

const path = require('path');
const rootPath = require('../utils/path');
const fs = require('fs');
const { json } = require('express');

const jsonPath = path.join(rootPath, 'data', 'products.json');

const Cart = require('./cart');

const getProductsFromFile = (cb) =>{
    
    fs.readFile(jsonPath, (err,fileContent)=>{
        if(err){
            cb([]);
        }else{
            cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class ProductWithFile {
    constructor(id,title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
      }
    
    save(){
        // products.push(this);
        this.id = Math.random().toString();
        getProductsFromFile( (products)=>{
            products.push(this);
            fs.writeFile(jsonPath,JSON.stringify(products), (err)=>{
                console.log("Error in saving file: " + err);
            });
        });  
    }

    update(){
        getProductsFromFile( (products)=>{
            const existingProductIdIndex = products.findIndex(prod=> prod.id==this.id);
            products[existingProductIdIndex] = this;
            fs.writeFile(jsonPath,JSON.stringify(products), (err)=>{
                console.log("Error in saving file: " + err);
            });
        });  
    }

    static fetchAll(cb){
        // return products;
        getProductsFromFile(cb);
    }

    static findById(id,cb){
        getProductsFromFile(products=>{
           const product = products.find(p => p.id == id);
           cb(product);
        });
    }

    static deleteById(id){
        console.log("Id to delete: " + id);
        getProductsFromFile(products=>{
            const product = products.find(prod=> prod.id==id);
            const updatedProducts = products.filter(prod=> prod.id != id);
            fs.writeFile(jsonPath, JSON.stringify(updatedProducts), err=>{
                if(!err){
                    Cart.deleteProductById(id,product.price);
                }
                console.log(err);
            });
         });
    }
}