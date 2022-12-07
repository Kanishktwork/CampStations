const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const ImageSchema=new Schema({
    url:String,
    filename:String
})
///Setting up to fix in cloudinary's image mainupulation properties
ImageSchema.virtual('thumbnail').get(function (){
    return this.url.replace('/upload', '/upload/w_200/h_200');
});

// https://res.cloudinary.com/dx8saxi8r/image/upload/c_crop,h_2500,r_21,w_3000/v1610228395/YelpCamp/gdepyfumjwlrskrdamar.jpg
ImageSchema.virtual('fitinframe').get(function (){
    // console.log("i work!")
    return this.url.replace('/upload', '/upload/c_crop,h_2500,r_21,w_3000');
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
    image: [ImageSchema],
    price: Number,
    description: String,
    geometry:{
        type: {
            type: String, 
            enum: ['Point'],
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    },
    location: String,
    author:{
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref : 'Review'
    }],
},opts);

///Setting up to fix in cluster map's format of properties & feautures
CampgroundSchema.virtual('properties.popUpMarkup').get(function (){
    return `<strong><a href="/campgrounds/${this.id}">${this.title}</a></strong>`
            // <p>${this.description.substring(0,25)}...</p>`
});

CampgroundSchema.post('findOneAndDelete', async(doc)=>{
    await Review.deleteMany({
        _id: {
            $in: doc.reviews
        }
    })
});

module.exports = mongoose.model('Campground', CampgroundSchema);