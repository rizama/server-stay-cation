const Item = require('../models/Item');
const Treasure = require('../models/Activity');
const Traveler = require('../models/Booking');
const Category = require('../models/Category');

module.exports = {
    landingPage: async (req, res) => {
        const mostPicked = await Item.find()
            .select('_id title country city price unit')
            .limit(5)
            .populate({ path: 'imageId', select: '_id imageUrl' });

        const treasures = await Treasure.find();
        const travelers = await Traveler.find();
        const cities = await Item.find();

        const categories = await Category.find()

        res.status(200).json({ 
            hero: {
                treasures: treasures.length,
                travelers: travelers.length,
                cities: cities.length
            },
            mostPicked, 
        });
    },
};
