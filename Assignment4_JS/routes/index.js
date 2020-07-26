'use strict';
var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcryptjs');
var userModel = require('../models/users');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { user: req.user, title: 'Home' });
});


//POST for login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureMessage: 'Invalid Login'
}));

/*Logout*/
router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

// GET login page
router.get('/login', function (req, res) {
    res.render('login');
});

// GET register page
router.get('/register', function (req, res) {
    res.render('register');
});

//POST register page
router.post('/register', function (req, res) {
    //insert a new registered user
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        var registeredUser = {
            email: req.body.userEmail,
            password: hash,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        };
        //Check if user already exists
        userModel.find({ email: registeredUser.email }, function (err, user) {
            if (err) console.log(err);
            if (user.length) console.log('Email already in use!');
            const newUser = new userModel(registeredUser);
            newUser.save(function (err) {
                console.log('Inserting new user!');
                if (err) console.log(err);
                req.login(newUser, function (err) {
                    console.log('Trying to login');
                    if (err) console.log(err);
                    return res.redirect('/');
                });
            });
        });
    });
});

module.exports = router;
