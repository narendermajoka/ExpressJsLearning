const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) =>{
    MongoClient.connect('mongodb+srv://narender:dkEJ8euV9cQaXl7T@cluster0.2wbhy1v.mongodb.net/shop?retryWrites=true&w=majority')
    .then(client=>{
        console.log('Mongo DB connected!!');
        _db = client.db();
        callback();
    })
    .catch(err=> console.log(err));
};

const getDb = ()=>{
    if(_db){
        return _db;
    }
    throw 'No database found!';
}
module.exports.mongoConnect = mongoConnect;
module.exports.getDb = getDb;