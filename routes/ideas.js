const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

// load model
require('../models/Idea');
const Idea = mongoose.model('idea');

// ideas add form
router.get('/add',ensureAuthenticated,(req,res) =>{
    console.log("isAuthenticated ?"+req.isAuthenticated());
    res.render("ideas/add");
})

// GET idea by id
router.get('/edit/:id',ensureAuthenticated,(req,res) =>{

    Idea.findOne({
        _id : req.params.id
    })
    .then((idea) => {
        if(idea.user != req.user.id){
            req.flash('error_msg','Not Authorised');
            res.redirect('/ideas');
        }else{
            res.render("ideas/edit",{idea : idea});
        }
        
    })
   
})

// GET all ideas
router.get('/',ensureAuthenticated,(req,res) => {

    Idea.find({user : req.user.id})
    .sort({date:'desc'})
    .then((ideas) => {
        res.render('ideas/index',{ideas:ideas});
    })
   
})

router.post('/',ensureAuthenticated,(req,res) => {
    
    var errors= [];
    if(!req.body.title){
         errors.push({"text" : "Please add a title"});
    }
    if(!req.body.details){
        errors.push({"text" : "Please add details"});
   }

   if(errors.length > 0){
      res.render('ideas/add',{
          errors : errors,
          title : req.body.title,
          details : req.body.details
      })
   }else{
       const newUser = {
           title : req.body.title,
           details : req.body.details,
           user : req.user.id
       }
       new Idea(newUser)
       .save()
       .then(idea =>{
        req.flash('success_msg','Video idea added.');
           res.redirect('/ideas');
       })
   }
    
})

router.put('/:id',ensureAuthenticated,(req,res) =>{
   
    Idea.findOne({
        _id : req.params.id
    })
    .then((idea) => {
        idea.title = req.body.title,
        idea.details = req.body.details

        idea.save()
        .then(idea => {
            req.flash('success_msg','Video idea updated.');
              res.redirect('/ideas');
        })
    })
})

router.delete('/:id',ensureAuthenticated,(req,res) =>{
   
    Idea.deleteOne({
        _id : req.params.id
    })
    .then( () => {
        req.flash('success_msg','Video idea deleted.');
        res.redirect("/ideas");
    }
    )
})


module.exports = router;