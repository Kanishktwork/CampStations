const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/YelpCampWithStyles', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});

    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            author:"5ff9b6a165f1fe35bc0ff8f8",
            geometry: { type: 'Point',
             coordinates: [
                      cities[random1000].longitude,
                      cities[random1000].latitude
                     ] } ,
            image: [
              {
                url: 'https://res.cloudinary.com/dx8saxi8r/image/upload/v1610058570/YelpCamp/coqg90rj7mox6ri9xdee.jpg',
                filename: 'YelpCamp/coqg90rj7mox6ri9xdee'
              },
              {
                url: 'https://res.cloudinary.com/dx8saxi8r/image/upload/v1610058583/YelpCamp/ihkjfqqpmao11xcfxfzt.jpg',
                filename: 'YelpCamp/ihkjfqqpmao11xcfxfzt'
              }
            ]
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})

