const Item = require('../models/Item');
const Treasure = require('../models/Activity');
const Traveler = require('../models/Booking');
const Category = require('../models/Category');

module.exports = {
    landingPage: async (req, res) => {
        try {
            const mostPicked = await Item.find()
                .select('_id title country city price unit imageId')
                .limit(5)
                .populate({ path: 'imageId', select: '_id imageUrl' });

            const treasures = await Treasure.find();
            const travelers = await Traveler.find();
            const cities = await Item.find();

            const categories = await Category.find()
                .select('_id name')
                .limit(3)
                .populate({
                    path: 'itemId',
                    select: '_id title country city imageId isPopular sumBooking',
                    perDocumentLimit: 4,
                    options: {
                        sort: {
                            sumBooking: -1,
                        },
                    },
                    populate: {
                        path: 'imageId',
                        select: '_id imageUrl',
                        perDocumentLimit: 1,
                    },
                });

            for (const category of categories) {
                for (const [i, item] of category.itemId.entries()) {
                    const getItem = await Item.findOne({ _id: item._id });
                    getItem.isPopular = false;
                    await getItem.save();
                    if (category.itemId[0]._id == item._id) {
                        getItem.isPopular = true;
                        getItem.save();
                    }
                }
            }

            res.status(200).json({
                hero: {
                    treasures: treasures.length,
                    travelers: travelers.length,
                    cities: cities.length,
                },
                mostPicked,
                categories,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
};
