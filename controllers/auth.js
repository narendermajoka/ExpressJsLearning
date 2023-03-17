const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); //inbuilt library in node
const {validationResult} = require('express-validator/check'); 

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

  const validationErrors = validationResult(req);
  if(!validationErrors.isEmpty()){
    return res.status(422).render('auth/login',{
      path: '/login',
      pageTitle: 'Login',
      errorMessage: validationErrors.array()[0].msg
    });
  }
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
    .catch(err => next(new Error(err)));
};

exports.postSignup = (req, res, next) => {
  
  const validationErrors = validationResult(req);
  if(!validationErrors.isEmpty()){
    return res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: validationErrors.array()[0].msg
    });
  }
  console.log('came forward');
  const email = req.body.email;
  const password = req.body.password;
  return bcrypt.hash(password, 12) //its async method
    .then(hashedPassord => {
      const user = new User({
        email: email,
        password: hashedPassord,
        cart: { items: [] }
      });
      return user.save();
    })
    .then(result => {
      res.redirect('/login');
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req,res,next)=>{

  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
    const email  =req.body.email;

    crypto.randomBytes(32, (err,buffer)=>{
        if(err){
            console.log(err);
           return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({email: email})
         .then(user=>{
            if(!user){
              req.flash('error', 'Email not found');
              return res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save().then(result=>{
              console.log('Paste this link in browser to reset password: ' + "http://localhost:3000/reset/"+token);
              res.redirect('/');
             });
         })
         .catch(err=>{
           next(new Error(err));
         });
    });
};

exports.getNewPassword = (req,res,next)=>{
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    const token = req.params.token;
    User.findOne({ resetToken: token,resetTokenExpiration: {$gt : Date.now()} })
        .then(user=>{
          if(!user){
              console.log('Token has expired');
              return res.redirect('/');
          }
          res.render('auth/new-password', {
            path: '/new-password',
            pageTitle: 'New Password',
            errorMessage: message,
            userId: user._id,
            passwordToken: token
          });
        }).catch(err=> next(new Error(err)));
};

exports.postNewPassword = (req,res,next)=>{
    const userId = req.body.userId;
    const newPassword = req.body.password;
    const token = req.body.passwordToken;
    User.findOne({_id: userId, resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
      .then(user=>{
           return bcrypt.hash(newPassword, 12) //its async method
                  .then(hashedPassord=>{
                    user.password = hashedPassord;
                    user.resetToken = null;
                    user.resetTokenExpiration = null;
                    return user.save();
                  });
      })
      .then(result=>{
        return res.redirect('/login');
      })
      .catch(err=>{
        next(new Error(err));
      });
};
