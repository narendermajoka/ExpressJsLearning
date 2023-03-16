const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session); //used to store session in mongodb
const csrf = require('csurf');
const flash = require('connect-flash');

const User = require('./models/user');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/shop';

const app = express();
const mongodbSore = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
});

const csrfProtection = csrf();

app.set('view engine', 'ejs');

const adminRoutes =  require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const path = require('path');


app.use(bodyParser.urlencoded()); //explicitly need to set body parse to get body in req.body
app.use(express.static(path.join(__dirname,'public'))); //avails the public folder to app
app.use(
    session({ secret: 'mysecret', resave: false, saveUninitialized: false, store: mongodbSore})
);
app.use(csrfProtection);
app.use(flash());

app.use((req,res,next)=>{

    if(!req.session.user){
        return next();
    }

    User.findById(req.session.user._id)
    .then(user=> {
        console.log('user found');
        req.user = user;
        next();
    })
    .catch(err=> console.log(err));
});

app.use((req,res,next)=>{
    res.locals.isAuthenticated = req.session.isLoggedIn,
    res.locals.csrfToken = req.csrfToken() //setting csrf token
    next();
});

app.use('/admin',adminRoutes); //define common context here for admin routes
app.use(shopRoutes);
app.use(authRoutes);


const errorController = require('./controllers/error');
app.use(errorController.get404);

mongoose.connect(MONGODB_URI)
.then(()=>{
    console.log('MongoDB connected, Starting Server');
    app.listen(3000);
}).catch(err=>{
    console.log(err);
});