var express = require('express');
var passport = require('passport');
require('../config/passport')(passport);
var router = express.Router();

/* GET login page */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login', message: req.flash('loginMessage') });
});

// process the login form
router.post('/login', passport.authenticate('local-login', {
  successRedirect : '/calendar', // redirect to the secure profile section
  failureRedirect : '/auth/login', // redirect back to the login page if there is an error
  failureFlash : true // allow flash messages
}));

/* GET signup page */
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Signup', message: req.flash('signupMessage') });
});

// process the signup form
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/calendar', // redirect to the secure profile section
  failureRedirect : '/auth/signup', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

/* GET logout */
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
