const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email : { 
       type: String,
       required : true
    },
    password: { 
        type: String, 
        required: true
    },
    cart : {
        items: [ 
                { 
                    productId: {
                        type: Schema.Types.ObjectId,
                        required: true,
                        ref: 'Product'
                    } , quantity: {
                         type: Number,
                         required: true
                    } 
                } 
            ]
    }
});

userSchema.methods.addToCart = function(product){
        const cartProductIndx = this.cart.items.findIndex(cp=>{
            return cp.productId.toString() === product._id.toString();
        });
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];
        if(cartProductIndx>=0){
            newQuantity = this.cart.items[cartProductIndx].quantity+1;
            updatedCartItems[cartProductIndx].quantity = newQuantity;
        }else{
            updatedCartItems.push({productId: product._id, quantity:newQuantity});
        }

        const updatedCart = { items: updatedCartItems};
        this.cart = updatedCart;
        return this.save();
};

userSchema.methods.removeFromCart = function(productId){
    const updatedCartItems = this.cart.items.filter(product=>{
                return product.productId.toString() !== productId.toString();
          });
    
     this.cart.items = updatedCartItems;
     return this.save();     
}

userSchema.methods.clearCart = function(){
        this.cart = { items: []};
        return this.save();
}


module.exports = mongoose.model('User',userSchema);

//     addOrder(){
//         const db = getDb();
//         return this.getCart()
//         .then(products=>{
//             const order = {
//                 items: products,
//                 user:{
//                     _id: new ObjectId(this._id),
//                     name: this.name
//                 }
//             }
//             return db.collection('orders').insertOne(order)
//         })
//         .then(result=>{
//             this.cart = { items: [] }; //empty cart in user object

//              return db.collection('users') //update user collection and set cart object with zero items
//                     .updateOne(
//                         {_id : new ObjectId(this._id)},
//                         { $set : { cart : { items: []} } }
//                         ); 
//         });
//     }

//     getOrders(){
//         const db = getDb();
//         return db.collection('orders').find({'user._id' : new ObjectId(this._id)})
//         .toArray();
//     }
// }

// module.exports = User;