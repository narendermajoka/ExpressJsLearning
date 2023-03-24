const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email :{
        type: String,
        required: true
    },
    password :{
        type: String,
        required: true
    },
    name :{
        type: String,
        required: true
    },
    status :{
        type: String,
        required: true,
        default: 'Active'
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref:'Post'
    }]
});

module.exports = new mongoose.model('User',  userSchema);