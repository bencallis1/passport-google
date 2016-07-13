var express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    cors = require('cors'),
    morgan = require('morgan'),
    app = express(),
    ejs = require('ejs'),
    mongoose = require('mongoose'),
    session = require('express-session');



require('./config/passport')(passport);

// Middleware

app.use(session({
    secret: 'devMountainISfullOFsecrets',
    resave: true,
    saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan('dev'));



function isLoggedIn(req, res, next) {
       console.log(req.isAuthenticated());
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


// route for home page
app.get('/', function(req, res) {
    res.render('index.ejs'); // load the index.ejs file
});

// route for showing the profile page
app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
        user : req.user // get the user out of session and pass to template
    });
});

// route for logging out
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});



// =====================================
// GOOGLE ROUTES =======================
// =====================================
// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails

app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// the callback after google has authenticated the user
app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));



var mongooseUri = 'mongodb://localhost/thirdparty';
mongoose.connect(mongooseUri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
    console.log('Mongoose uri:', mongooseUri);
});



app.listen(3000, function() {
    console.log('listening on port 3000');
});
