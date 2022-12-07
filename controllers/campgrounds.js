const Campground = require('../models/campground');
const {cloudinary}=require('../cloudinary')

const mbxGeocoding= require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken= process.env.MAPBOX_TOKENS
const geocoder= mbxGeocoding({accessToken: mapBoxToken})

module.exports.index=async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderForm=(req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground= async (req, res, next) => {
    const geoData=await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
        }).send()
 
    const campground = new Campground(req.body.campground);
    campground.geometry=geoData.body.features[0].geometry;
    campground.author= req.user._id;
    campground.image= req.files.map( f =>({url:f.path, filename:f.filename}));
    await campground.save();
    // console.log(campground)
    req.flash('success','Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`)   
}

module.exports.showpage=async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');

    if(!campground){
        req.flash('error','Cannot find the campground');
        return(res.redirect('/campgrounds'))
    }
    // console.log(campground.image)
    res.render('campgrounds/show', { campground });
}

module.exports.editCampground=async (req, res) => {
    const campground = await Campground.findById(req.params.id) 
    if(!campground){
        req.flash('error','Cannot find the campground');
        return(res.redirect('/campgrounds'))
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground= async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
        const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
        const imgs=req.files.map( f =>({url:f.path, filename:f.filename}))
        campground.image.push(...imgs);
        await campground.save();

        if(req.body.deleteImages){
            for(let filename of req.body.deleteImages){
              await  cloudinary.uploader.destroy(filename)
            }
            await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
        }
console.log("DID IT DO?")
        console.log(campground.geometry.coordinates);
        req.flash('success','Successfully edited the campground');
        res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground=async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully Deleted a campground');
    res.redirect('/campgrounds');
}