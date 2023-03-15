const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');

const adminRoutes =  require('./routes/admin');
const shopRoutes = require('./routes/shop');

const path = require('path');


app.use(bodyParser.urlencoded()); //explicitly need to set body parse to get body in req.body
app.use(express.static(path.join(__dirname,'public'))); //avails the public folder to app

app.use((req,res,next)=>{
    User.findById('641150a3e9ba37ec88b12a16')
    .then(user=> {
        req.user = user;
        next();
    })
    .catch(err=> console.log(err));
});

app.use('/admin',adminRoutes); //define common context here for admin routes
app.use(shopRoutes);

const errorController = require('./controllers/error');
app.use(errorController.get404);

mongoose.connect('mongodb+srv://narender:AQGuoZvosSdPmvIw@cluster0.2wbhy1v.mongodb.net/shop?retryWrites=true&w=majority')
.then(()=>{
    console.log('MongoDB connected, Starting Server');

    User.findById('641150a3e9ba37ec88b12a16')
    .then(user=>{
        if(!user){
            const user = new User({
                name : 'Narender',
                email: 'narendermjk.33@gmail.com',
                cart: {
                    items: []
                }
            });
            user.save();
        }
    }).catch(err=> console.log(err));
    
    app.listen(3000);
}).catch(err=>{
    console.log(err);
});