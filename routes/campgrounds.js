const express=require('express');
const router= express.Router();

const multer  = require('multer');
const {storage}= require('../cloudinary')
const upload = multer({ storage })



const catchAsync= require('../utilities/catchAsync');
// const Campground = require('../models/campground');
const { isLoggedIn,validateCampground,isAuthor } = require('../middleware');
const campgrounds= require('../controllers/campgrounds')

router.route('/')
    .get(campgrounds.index)
    .post(isLoggedIn ,upload.array('campground[image]'),  validateCampground ,catchAsync(campgrounds.createCampground))
    
router.get('/new', isLoggedIn , campgrounds.renderForm)

router.route('/:id')
    .get( catchAsync(campgrounds.showpage))
    .put(isLoggedIn ,isAuthor,upload.array('campground[image]'),validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit',isLoggedIn, isAuthor,catchAsync(campgrounds.editCampground))

module.exports=router;