const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//load user model
require('../models/User');
const User = mongoose.model('users');

router.get('/login',(req,res) => {
    res.render('users/login');
});

router.get('/register',(req,res) => {
    res.render('users/register');
});

//login post
router.post('/login',(req,res,next) => {
    passport.authenticate('local',{
        successRedirect : '/ideas',
        failureRedirect : '/users/login',
        failureFlash : true
    })(req,res,next);
})

router.post('/register',(req,res) => {
   let errors = [];
   if(req.body.password != req.body.password2){
       errors.push({text:"Passwords do not match."});
   }
   if(req.body.password.length < 4){
    errors.push({text:"Password length should be at least 4"});
   }
   if(errors.length > 0){
       res.render('users/register',{
         errors : errors,
         name : req.body.name,
         email : req.body.email,
         password : req.body.password,
         password2 : req.body.password2
     }
    );
   }else{
       User.findOne({email : req.body.email}, (err,user)=> {
           if(user){
                 req.flash('error_msg','Email already in use.');
                 res.redirect('/users/register');
           }else{
            const newUser = new User({
                name : req.body.name,
                email : req.body.email,
                password : req.body.password,
            })
            bcrypt.genSalt(10,(err,salt) => {
                bcrypt.hash(newUser.password, salt, (err,hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                    .then(user => {
                        req.flash('success_msg','You are now registered and can login to your account.');
                        res.redirect('/users/login');
                    })
                    .catch((err) => {
                        console.log(err);
                        return ;
                    })
                });
            });
           }
       })
    }
});

// logout user
router.get('/logout',(req,res) =>{
    console.log(req.user);
    req.logout();
    req.flash('success', "You are logged out !");
    res.redirect('/users/login');
})



module.exports =router;