
const mongodb = require('mongodb');
const getDb = require('../utils/database').getDb;
class Product {
    constructor(id, title, imageUrl, description, price, userId) {
        if(id){
            this._id = new mongodb.ObjectId(id);
        }
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
        this.userId = userId;
      }

    save(){
        const db = getDb();
        let dpOperation;
        if(this._id){ //update the product
            dpOperation = db.collection('products')
                    .updateOne({_id: this._id}, {$set : this} );
        }else{
            dpOperation =  db.collection('products').insertOne(this);
        }
        return dpOperation.then((result)=>{
            console.log(result);
        })
        .catch(err=> console.log(err)); 
    }
    
    static fetchAll(){
        const db = getDb();
        return db.collection('products').find().toArray()
        .then(products=>{
            console.log(products);
            return products;
        })
        .catch(err=> console.log(err));
    }

    static findById(id){
        const db = getDb();
        return db.collection('products').find({_id: new mongodb.ObjectId(id)})
        .next()
        .then(product=>{
            console.log(product);
            return product;
        })
        .catch(err=>console.log(err));
    }

    static deleteById(id){
        const db = getDb();
        return db.collection('products').deleteOne({_id: new mongodb.ObjectId(id)})
        .then(result=>{
            console.log(result);
            //return product;
        })
        .catch(err=>console.log(err));
    }

}

module.exports = Product;