const Category = require("../models/Category");

module.exports = {
    viewDashboard: (req, res) => {
        res.render('admin/dashboard/view_dashboard');
    },

    viewCategory: async (req, res) => {
        const categories = await Category.find();

        res.render('admin/category/view_category', { categories });
    },
    storeCategory: async (req, res) => {
        const name = req.body.name;
        await Category.create({ name });

        res.redirect('/admin/categories');
    },
    updateCategory: async (req, res) => {
        const { id, name } = req.body;

        const category = await Category.findOne({ _id: id });
        category.name = name;
        await category.save();

        res.redirect('/admin/categories');
    },
    destroyCategory: async (req, res) => {
        const { id } = req.params;

        const category = await Category.findOne({ _id: id });
        await category.remove();

        res.redirect('/admin/categories');
    },

    viewBank: (req, res) => {
        res.render('admin/bank/view_bank');
    },

    viewItem: (req, res) => {
        res.render('admin/item/view_item');
    },

    viewBooking: (req, res) => {
        res.render('admin/booking/view_booking');
    }
};