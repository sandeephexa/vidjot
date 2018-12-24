const express = require("express");
const app = express();
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const port = process.env.PORT || 3000;
 
mongoose.connect('mongodb://sandy:sandy444@ds217864.mlab.com:17864/vidjot',{ useNewUrlParser: true })
.then(() => {
    console.log("mongoDB connected ...");
})
.catch((err) => {
    console.log("something wrong ...");
})

// load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// passport config
require('./config/passport')(passport);

// static folder
app.use(express.static(path.join(__dirname,'public')));

// use handlebars view-engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(methodOverride('_method'));

// express-session middleware
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// passport session
app.use(passport.initialize());
app.use(passport.session());

// connect-flass
app.use(flash());

// Global variables
app.use(function(req,res,next){ 
     res.locals.success_msg = req.flash('success_msg');
     res.locals.error_msg = req.flash('error_msg');
     res.locals.error = req.flash('error');
     res.locals.user = req.user || null;
     next();
});

// welcome screen
app.get('/',(req,res) =>{
    const title = "Welcome1";
    res.render("index",{title : title});
})

app.get('/about',(req,res) =>{
    
    res.render("about");
})

// use routes
app.use('/ideas',ideas);
app.use('/users',users);

app.listen(port,() => {
    console.log(`listening on ...${port}`);
});

