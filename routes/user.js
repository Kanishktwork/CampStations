const express=require('express');
const router= express.Router();
const User= require('../models/user');
const passport= require('passport');
const users = require('../controllers/users');
// const Localstrategy= require('passport-local');

const catchAsync= require('../utilities/catchAsync');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.registerUser))

router.route('/login')
    .get(users.renderLogin )
    .post(passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'}) ,users.login)

router.get('/logout',users.logout)

module.exports= router;
