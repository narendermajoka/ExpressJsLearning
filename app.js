const express = require('express');
const bodyParser = require('body-parser');

const mongoConnect = require('./utils/database').mongoConnect;
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');

const adminRoutes =  require('./routes/admin');
const shopRoutes = require('./routes/shop');

const path = require('path');


app.use(bodyParser.urlencoded()); //explicitly need to set body parse to get body in req.body
app.use(express.static(path.join(__dirname,'public'))); //avails the public folder to app

app.use((req,res,next)=>{
    User.findById('64102e48b074eb7b3b50b3ea')
    .then(user=> {
        req.user = new User(user._id, user.name, user.email, user.cart);
        next();
    })
    .catch(err=> console.log(err));
});

app.use('/admin',adminRoutes); //define common context here for admin routes
app.use(shopRoutes);

const errorController = require('./controllers/error');
app.use(errorController.get404);

mongoConnect(()=>{
    app.listen(3000);
});