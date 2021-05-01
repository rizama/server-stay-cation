const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Item = require('../models/Item');
const Image = require('../models/Image');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    viewDashboard: (req, res) => {
        res.render('admin/dashboard/view_dashboard', {
            title: 'Staycation | Dashboard ',
        });
    },

    viewCategory: async (req, res) => {
        try {
            const categories = await Category.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };
            res.render('admin/category/view_category', {
                categories,
                alert,
                title: 'Staycation | Categories',
            });
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

    viewBank: async (req, res) => {
        try {
            const bank = await Bank.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };
            res.render('admin/bank/view_bank', {
                title: 'Staycation | Bank',
                alert,
                bank,
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },
    storeBank: async (req, res) => {
        try {
            const { name, nameBank, nomorRekening } = req.body;
            await Bank.create({
                name,
                nameBank,
                nomorRekening,
                imageUrl: `images/${req.file.filename}`,
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
    updateBank: async (req, res) => {
        try {
            const { id, name, nameBank, nomorRekening } = req.body;

            const bank = await Bank.findOne({ _id: id });

            bank.name = name;
            bank.nameBank = nameBank;
            bank.nomorRekening = nomorRekening;
            if (req.file) {
                try {
                    await fs.unlink(path.join(`public/${bank.imageUrl}`));
                } catch (error) {
                    console.log('Image Not Found');
                }
                bank.imageUrl = `images/${req.file.filename}`;
            }
            await bank.save();

            req.flash('alertMessage', 'Success Update Bank');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },
    destroyBank: async (req, res) => {
        try {
            const { id } = req.params;

            const bank = await Bank.findOne({ _id: id });
            try {
                await fs.unlink(path.join(`public/${bank.imageUrl}`));
            } catch (error) {
                console.log('Image Not Found');
            }
            await bank.remove();

            req.flash('alertMessage', 'Success Delete Bank');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },

    viewItem: async (req, res) => {
        try {
            const item = await Item.find()
                .populate({
                    path: 'imageId',
                    select: 'id imageUrl',
                })
                .populate({ path: 'categoryId', select: 'id name' });
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };
            const categories = await Category.find();
            res.render('admin/item/view_item', {
                title: 'Staycation | Items',
                categories,
                alert,
                action: 'view',
                item,
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/items');
        }
    },
    storeItem: async (req, res) => {
        try {
            const { categoryId, title, price, city, about } = req.body;
            if (req.files.length > 0) {
                const category = await Category.findOne({ _id: categoryId });
                const newItem = {
                    categoryId: category._id,
                    title,
                    description: about,
                    price,
                    city,
                };
                const item = await Item.create(newItem);
                category.itemId.push({ _id: item.id });
                await category.save();
                for (let i = 0; i < req.files.length; i++) {
                    const imageSave = await Image.create({
                        imageUrl: `images/${req.files[i].filename}`,
                    });
                    item.imageId.push({ _id: imageSave._id });
                    await item.save();
                }
            }
            req.flash('alertMessage', 'Success Add Bank');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/items');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/items');
        }
    },
    showImageItem: async (req, res) => {
        try {
            const { id } = req.params;
            const item = await Item.findOne({ _id: id }).populate({
                path: 'imageId',
                select: 'id imageUrl',
            });

            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };
            const categories = await Category.find();
            res.render('admin/item/view_item', {
                title: 'Staycation | Show Item Images',
                categories,
                alert,
                action: 'show image',
                item,
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/items');
        }
    },
    showEditItem: async (req, res) => {
        try {
            const { id } = req.params;
            const item = await Item.findOne({ _id: id }).populate({
                path: 'imageId',
                select: 'id imageUrl',
            });

            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };
            const categories = await Category.find();
            console.log(item);
            res.render('admin/item/view_item', {
                title: 'Staycation | Edit Item',
                categories,
                alert,
                action: 'edit',
                item,
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/items');
        }
    },
    updateItem: async (req, res) => {
        try {
            const { id } = req.params;
            const { categoryId, title, price, city, about } = req.body;
            const item = await Item.findOne({ _id: id })
                .populate({
                    path: 'imageId',
                    select: 'id imageUrl',
                })
                .populate({ path: 'categoryId', select: 'id name' });

            if (req.files.length) {
                for (let i = 0; i < item.imageId.length; i++) {
                    const imageUpdate = await Image.findOne({
                        _id: item.imageId[i]._id,
                    });
                    await fs.unlink(
                        path.join(`public/${imageUpdate.imageUrl}`)
                    );
                    imageUpdate.imageUrl = `images/${req.files[i].filename}`;
                    await imageUpdate.save();
                }
                item.title = title;
                item.price = price;
                item.city = city;
                item.description = about;
                item.categoryId = categoryId;
                await item.save();
                req.flash('alertMessage', 'Success update Item');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/items');
            } else {
                item.title = req.title;
                item.price = req.price;
                item.city = req.city;
                item.description = req.about;
                item.categoryId = req.categoryId;
                await item.save();
                req.flash('alertMessage', 'Success Update Item');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/items');
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/items');
        }
    },
    destroyItem: (req, res) => {
        try {
            const { id } = req.params;
            const item = await Item.findOne({ _id: id }).populate('imageId');
            for (let i = 0; i < item.imageId.length; i++) {
                Image.findOne({ _id: item.imageId[i]._id }).then((image) => {
                    fs.unlink(path.join(`public/${image.imageUrl}`));
                    image.remove();
                }).catch((error) => {
                    req.flash('alertMessage', `${error.message}`);
                    req.flash('alertStatus', 'danger');
                    res.redirect('/admin/items');
                });
            }
            await item.remove();
            req.flash('alertMessage', 'Success delete Item');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/items');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/items');
        }
    },

    viewBooking: (req, res) => {
        res.render('admin/booking/view_booking', {
            title: 'Staycation | Booking',
        });
    },
};
