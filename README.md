# ExpressJsLearning
Node js with ExpressJs

Express Js is framework for developing node js application

request > middlewares > controller

middlewares are created by app.use((req,res,next)=>{});
next method must be called from every middleware

we can use app.use and app.get or app.post to create middlewares or controllers
when defining app.use order does matter if / is written at top and response is returning from it than
app.use under this root slash will won't work

app.get will search for exact match whereas app.use will use regex

__dirname is global variable which gives us the path to the directory in which it is being used

enable static like css serving in express as 
app.use(express.static(path.join(__dirname,'public'))); //avails the public folder to app

Templating engines replaces the values in placeholders in html
1. EJS
2. Pug(Jade)
3. Handlebars

app.set('view engine', 'pug'); //set template engine
app.set('views', 'views'); //set where the views are stored, 2nd var is name of directory

product-with-file.js is to store everything in json and read and write in json only
but in actual we will use the DB

one way to execute sql queries is like


const db = require('./utils/database');

db.execute('select * from products')
.then((result)=>{
    console.log(result[0]);
})
.catch(err=>{
    console.log(err);
});

And database script looks like:
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'node-complete'
});

module.exports = pool.promise();


We will use ORM library Sequelize to run sql queries easily in node

in sequelize we can get all the products of user as:-
first set the current user in req object in app.js
also create below mapping:-
User.hasMany(Product);

Now we can call:-
req.user.getProducts()
  .then(products=>{
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err=> console.log(err)); 

  if mongoose doesn't return full data of oject we can use ._doc to get full object
  as we did in postOrder of shop.js

  To create the session in node js app we need to install express-session
  than configure session middleaware as:
  app.use(
    session({ secret: 'mysecret', resave: false, saveUninitialized: false})
);

above line will create a encrypted cookie in client's browser
but session will be stored in memory of application Server, which is not good practice, we will change
above to store in mongodb

now we can directly set and get values from session as
req.session.isLoggedIn = true;

To store session in mongodb:
install: npm install connect-mongodb-session
const MongoDBStore = require('connect-mongodb-session')(session); //used to store session in mongodb
const mongodbSore = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
});
app.use(
    session({ secret: 'mysecret', resave: false, saveUninitialized: false, store: mongodbSore})
);

if we set user in session object and directly get this user using req.session.user
than it will be a simple user object we won't get mongoose functions in it to call
so we will create a root level middleware which will get userid from session
call mongodb to fetch object and set this object in req, and we will use this user from req not session
in controllers

Its not good practice to store plain passwords in DB
we are using npm install bcryptjs

We are protecting our application from cross site forgery attach(csrf)
by using npm install csurf

for every get request we will add csrf token and isAuthenticated in root level middleware
and set these values in res.local (doing in app.js)

Now these values will be available to our views we will set this csrf token in every form post request
in hidden field which will be verified by our application else post request will not work
eg.
<input type="hidden" name="_csrf" value="<%= csrfToken %>" />

csurf is now deprecated

Angular framework has csrf protection built in.

To show the error messages to user we will use npm install connect-flash
problem is that when we use res.redirect it will create a new request, than how can we pass the error message to this new request

to solve above problem we using connect-flash which stores the data temporarily in session than remove quickly once it is shown to user

we are business validations using npm install express-validator
It basically provides inbuilt methods to check for some use cases like valid email
valid string, we can pass custom validator to this also, it also provides method of data santizations
like trim, lowercase, normalize email etc.

in routes we are passing authvalidator's methods to post methods
then results can be gathered by validationResult(req) which return array of errors