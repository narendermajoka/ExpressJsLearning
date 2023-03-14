const getDb = require('../utils/database').getDb;
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;
class User {
    constructor(id, username, email, cart){
        this._id = id;
        this.name = username;
        this.email = email;
        this.cart = cart; // { items: []}
    }

    save(){
       const db = getDb();
       return db.collection('users').insertOne(this);
    }

    addToCart(product){
        const cartProductIndx = this.cart.items.findIndex(cp=>{
            return cp.productId.toString() === product._id.toString();
        });
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];
        if(cartProductIndx>=0){
            newQuantity = this.cart.items[cartProductIndx].quantity+1;
            updatedCartItems[cartProductIndx].quantity = newQuantity;
        }else{
            updatedCartItems.push({productId: new ObjectId(product._id), quantity:newQuantity});
        }

        const updatedCart = { items: updatedCartItems};
        const db = getDb();
        return db.collection('users').updateOne(
            {_id : new ObjectId(this._id)},
            { $set: {cart: updatedCart}}
        );

    }

    getCart(){
        
        const db = getDb();
        const productIds = [];
        const quantities = {};
    
        this.cart.items.forEach((ele) => {
            let prodId = ele.productId;
    
            productIds.push(prodId);
            quantities[prodId] = ele.quantity;
        });
 
        return db
            .collection('products')
            .find({ _id: { $in: productIds } })
            .toArray()
            .then((products) => {
                return products.map((p) => {
                    return { ...p, quantity: quantities[p._id] };
                });
            });
    }

    deleteItemFromCart(productId){
        const updatedCartItems = this.cart.items.filter(product=>{
            return product.productId.toString() !== productId.toString();
        });
        const db = getDb();
        return db.collection('users')
        .updateOne(
            {_id : new ObjectId(this._id)},
            { $set : { cart : { items: updatedCartItems} } }
            );
    }

    static findById(id){
        const db = getDb();
        return db.collection('users').findOne({_id : new ObjectId(id)});
    }
    
    addOrder(){
        const db = getDb();
        return this.getCart()
        .then(products=>{
            const order = {
                items: products,
                user:{
                    _id: new ObjectId(this._id),
                    name: this.name
                }
            }
            return db.collection('orders').insertOne(order)
        })
        .then(result=>{
            this.cart = { items: [] }; //empty cart in user object

             return db.collection('users') //update user collection and set cart object with zero items
                    .updateOne(
                        {_id : new ObjectId(this._id)},
                        { $set : { cart : { items: []} } }
                        ); 
        });
    }

    getOrders(){
        const db = getDb();
        return db.collection('orders').find({'user._id' : new ObjectId(this._id)})
        .toArray();
    }
}

module.exports = User;