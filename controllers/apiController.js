const Item = require('../models/Item');
const Treasure = require('../models/Activity');
const Traveler = require('../models/Booking');
const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Member = require('../models/Member');
const Booking = require('../models/Booking');

const moment = require('moment');
require('moment-timezone');

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

            const testimonial = {
                _id: 'asd1293uasdads1',
                imageUrl: 'images/testimonial2.jpg',
                name: 'Happy Family',
                rate: 4.55,
                content:
                    'What a great trip with my family and I should try again next time soon ...',
                familyName: 'Angga',
                familyOccupation: 'Product Designer',
            };

            res.status(200).json({
                hero: {
                    treasures: treasures.length,
                    travelers: travelers.length,
                    cities: cities.length,
                },
                mostPicked,
                categories,
                testimonial,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    detailPage: async (req, res) => {
        try {
            const { id } = req.params;
            const item = await Item.findOne({ _id: id })
                .populate({
                    path: 'featureId',
                    select: '_id name qty imageUrl',
                })
                .populate({
                    path: 'activityId',
                    select: '_id name type imageUrl',
                })
                .populate({ path: 'imageId', select: '_id imageUrl' });

            const bank = await Bank.find();

            const testimonial = {
                _id: 'asd1293uasdads1',
                imageUrl: 'images/testimonial1.jpg',
                name: 'Happy Family',
                rate: 4.55,
                content:
                    'What a great trip with my family and I should try again next time soon ...',
                familyName: 'Angga',
                familyOccupation: 'Product Designer',
            };

            res.status(200).json({
                ...item._doc,
                bank,
                testimonial,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    bookingPage: async (req, res) => {
        const {
            idItem,
            duration,
            // price,
            bookingStartDate,
            bookingEndDate,
            firstName,
            lastName,
            email,
            phoneNumber,
            accountHolder,
            bankFrom,
        } = req.body;

        if (!req.file) {
            return res.status(404).json({ message: 'Image not found' });
        }

        if (
            idItem === undefined ||
            duration === undefined ||
            // price === undefined ||
            bookingStartDate === undefined ||
            bookingEndDate === undefined ||
            firstName === undefined ||
            lastName === undefined ||
            email === undefined ||
            phoneNumber === undefined ||
            accountHolder === undefined ||
            bankFrom === undefined
        ) {
            return res.status(404).json({ message: 'Lengkapi semua field' });
        }

        const item = await Item.findOne({ _id: idItem });

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        console.log(moment(bookingStartDate, 'DD-MM-YYYY').tz('Asia/Jakarta').toDate());

        item.sumBooking += 1;

        await item.save();

        let total = item.price * duration;
        let tax = total * 0.1;

        const invoice = Math.floor(1000000 + Math.random() * 9000000);

        const member = await Member.create({
            firstName,
            lastName,
            email,
            phoneNumber,
        });

        const newBooking = {
            invoice,
            bookingStartDate: moment(bookingStartDate, 'DD-MM-YYYY').tz('Asia/Jakarta').toDate(),
            bookingEndDate: moment(bookingEndDate, 'DD-MM-YYYY').tz('Asia/Jakarta').toDate(),
            total: (total += tax),
            itemId: {
                _id: item.id,
                title: item.title,
                price: item.price,
                duration: duration,
            },

            memberId: member.id,
            payments: {
                proofPayment: `images/${req.file.filename}`,
                bankFrom: bankFrom,
                accountHolder: accountHolder,
            },
        };

        const booking = await Booking.create(newBooking);

        return res.status(201).json({ message: 'Success Booking', booking });
    },
};
