const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email : email})
    .then(user => {
      if(!user){
         req.flash('error', 'Invalid email.');
         return res.redirect('/login');
      }
      bcrypt.compare(password, user.password)
            .then(matched=>{
                if(matched){
                  req.session.isLoggedIn = true;
                  req.session.user = user;
                  req.session.save(err => {
                    console.log(err);
                    return res.redirect('/');
                  });
                }else{
                  req.flash('error', 'Invalid password.');
                  res.redirect('/login');
                }
            });
      
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({email: email})
      .then(user=>{
        if(user){
          console.log('user already exists');
          return res.redirect('/signup');
        }else{
          return bcrypt
                  .hash(password, 12) //its async method
                      .then(hashedPassord=>{
                        const user = new User({
                          email: email,
                          password: hashedPassord,
                          cart: { items: []}
                        });
                        return user.save();
                      })
                      .then(result=>{
                          res.redirect('/login');
                      }); 
                    }
      })
      .catch(err=> console.log(err));

};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
