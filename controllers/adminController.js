const Category = require("../models/Category");
const Bank = require("../models/Bank");

module.exports = {
    viewDashboard: (req, res) => {
        res.render('admin/dashboard/view_dashboard', {
            title: "Staycation | Dashboard"
        });
    },

    viewCategory: async (req, res) => {
        try {
            const categories = await Category.find();
            const alertMessage = req.flash("alerMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };
            res.render('admin/category/view_category', { categories, alert, title: "Staycation | Categories" });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/categories');
        }
    },
    storeCategory: async (req, res) => {
        try {
            const name = req.body.name;
            await Category.create({ name });
            req.flash('alertMessage', 'Success Add Category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/categories');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/categories');
        }

    },
    updateCategory: async (req, res) => {
        try {
            const { id, name } = req.body;

            const category = await Category.findOne({ _id: id });
            category.name = name;
            await category.save();
            req.flash('alertMessage', 'Success Update Category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/categories');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/categories');
        }
    },
    destroyCategory: async (req, res) => {
        try {
            const { id } = req.params;

            const category = await Category.findOne({ _id: id });
            await category.remove();

            req.flash('alertMessage', 'Success Delete Category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/categories');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/categories');
        }
    },

    viewBank: (req, res) => {
        try {
            const bank = await Bank.find();
            const alertMessage = req.flash("alerMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };
            res.render('admin/bank/view_bank', {
                title: "Staycation | Bank",
                alert,
                bank
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
        
    },
    storeBank: async (req, res) => {
        try {
            const {name, nameBank, nomorRekening} = req.body;
            await Bank.create({ 
                name, 
                nameBank, 
                nomorRekening,
                imageUrl: `image/${req.file.filename}`
            });
            req.flash('alertMessage', 'Success Add Bank');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }

    },

    viewItem: (req, res) => {
        res.render('admin/item/view_item', {
            title: "Staycation | Items"
        });
    },

    viewBooking: (req, res) => {
        res.render('admin/booking/view_booking', {
            title: "Staycation | Booking"
        });
    }
};