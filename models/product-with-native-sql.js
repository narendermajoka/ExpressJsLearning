
const products = [];

const Cart = require('./cart');

const db = require('../utils/database');

module.exports = class ProductWithNativeSql{
    constructor(id,title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
      }
    
    save(){
        // products.push(this);
        
       return db.execute('insert into products (title, price, description, imageUrl) values(?,?,?,?)',
       [this.title,this.price,this.description,this.imageUrl]
       );
    }

    update(){
       
    }

    static fetchAll(){
       return db.execute('Select * from products');
    }

    static findById(id){
      return db.execute('select * from products where id = ? ', [id]);
    }

    static deleteById(id){
        
    }
}