const express = require('express');
const bodyParser = require('body-parser');
const app = express();


//uncomment below 4 lines for Handlebar viewEngine
//const expressHbs = require('express-handlebars');
// app.engine('hbs',expressHbs.engine({extname: 'hbs', layoutsDir: 'views/layouts', defaultLayout:'main-layout'})); //hbs name give by me, now files need to be created as extension hbs
// app.set('view engine', 'hbs'); //set template engine
// app.set('views', 'views');

app.set('view engine', 'ejs');

const adminRoutes =  require('./routes/admin');
const shopRoutes = require('./routes/shop');

const path = require('path');
const { extname } = require('path');

//middleware
// app.use((req,res,next)=>{
//     console.log("in first middleware");
//     next(); //pass request to next middleware if any
// });


// app.use((req,res,next)=>{
//     console.log("in second middleware");
//     //res.send('<h2>Hii from new Server</h2>');
// });


// app.use('/add-product', (req,res,next)=>{
//     console.log('In add product middleware');
//     res.send('<h2>The Add Product Page</h2>');
// });

// app.use('/', (req,res,next)=>{
//     console.log('In root middleware'); //this will run for add product also
// });


app.use(bodyParser.urlencoded()); //explicitly need to set body parse to get body in req.body
app.use(express.static(path.join(__dirname,'public'))); //avails the public folder to app

app.use('/admin',adminRoutes); //define common context here for admin routes
app.use(shopRoutes);

const errorController = require('./controllers/error');
app.use(errorController.get404);

/* const db = require('./utils/database');

db.execute('select * from products')
.then((result)=>{
    console.log(result[0]);
})
.catch(err=>{
    console.log(err);
}); */

const sequelize = require('./utils/database');

const Product = require('./models/product');
const User  = require('./models/user');

Product.belongsTo(User, {constraints: true, onDelete:'CASCADE'}); //creates foreign key in product for user table

sequelize.sync(
    // {force: true} // don't use this property in production as it recreates tables
)  //create tables automatically
.then(result=>{
    return User.findByPk(1);
    //console.log(result); prints the startup queries and all other data
})
.then(user=>{
    if(!user){
        return User.create({name:'Narender', email: 'narendermjk.33@gmail.com'});
    }
})
.catch(err=> console.log(err)); 

app.use((req,res,next)=>{
    User.findByPk(1)
    .then(user=>{
        req.user = user;
        next();
    }).catch(err=> console.log(err));     
})

app.listen(3000);