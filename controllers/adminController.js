const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Item = require('../models/Item');
const Image = require('../models/Image');
const Feature = require('../models/Feature');
const Activity = require('../models/Activity');
const Booking = require('../models/Booking');
const Member = require('../models/Member');
const User = require('../models/User');
const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcryptjs');

module.exports = {
    viewLogin: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };
            if (req.session.user == null || req.session.user == undefined) {
                return res.render('index', {
                    alert,
                    title: 'Staycation | Login',
                });
            }

            return res.redirect('/admin/dashboard');
        } catch (error) {
            return res.redirect('admin/login');
        }
    },

    loginAction: async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username: username });
            if (!user) {
                req.flash('alertMessage', 'User yang anda masukan tidak ada!!');
                req.flash('alertStatus', 'danger');
                return res.redirect('/admin/login');
            }
            const isPasswordMatch = await bcrypt.compare(
                password,
                user.password
            );
            if (!isPasswordMatch) {
                req.flash(
                    'alertMessage',
                    'Password yang anda masukan tidak cocok!!'
                );
                req.flash('alertStatus', 'danger');
                return res.redirect('/admin/login');
            }

            req.session.user = {
                id: user.id,
                username: user.username,
            };

            return res.redirect('/admin/dashboard');
        } catch (error) {
            console.log(error);
            res.redirect('/admin/login');
        }
    },

    logoutAction: (req, res) => {
        req.session.destroy();
        req.redirect('admin/login');
    },

    viewDashboard: async (req, res) => {
        try {
            const member = await Member.find();
            res.render('admin/dashboard/view_dashboard', {
                title: 'Staycation | Dashboard ',
                user: req.session.user,
                member
            });
        } catch (error) {
            res.redirect('/admin/dahsboard');
        }
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
                user: req.session.user,
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
                user: req.session.user,
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
                user: req.session.user,
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
                user: req.session.user,
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
                user: req.session.user,
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
    destroyItem: async (req, res) => {
        try {
            const { id } = req.params;
            const item = await Item.findOne({ _id: id }).populate('imageId');
            for (let i = 0; i < item.imageId.length; i++) {
                Image.findOne({ _id: item.imageId[i]._id })
                    .then((image) => {
                        fs.unlink(path.join(`public/${image.imageUrl}`));
                        image.remove();
                    })
                    .catch((error) => {
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
    viewDetailItem: async (req, res) => {
        const { itemId } = req.params;
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };

            const feature = await Feature.find({ itemId: itemId });
            const activity = await Activity.find({ itemId: itemId });

            res.render('admin/item/detail_item/view-detail-item', {
                title: 'Staycation | Detail Item',
                alert,
                itemId,
                feature,
                activity,
                user: req.session.user,
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/items/show-detail-item/${itemId}`);
        }
    },
    addFeature: async (req, res) => {
        const { name, qty, itemId } = req.body;

        try {
            if (!req.file) {
                req.flash('alertMessage', 'Image not found');
                req.flash('alertStatus', 'danger');
                res.redirect(`/admin/items/show-detail-item/${itemId}`);
            }
            const feature = await Feature.create({
                name,
                qty,
                itemId,
                imageUrl: `images/${req.file.filename}`,
            });

            const item = await Item.findOne({ _id: itemId });
            item.featureId.push({ _id: feature._id });
            await item.save();
            req.flash('alertMessage', 'Success Add Feature');
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/items/show-detail-item/${itemId}`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/items/show-detail-item/${itemId}`);
        }
    },
    updateFeature: async (req, res) => {
        try {
            const { id, name, qty, itemId } = req.body;

            console.log(itemId);

            const feature = await Feature.findOne({ _id: id });

            feature.name = name;
            feature.qty = qty;

            if (req.file) {
                try {
                    await fs.unlink(path.join(`public/${feature.imageUrl}`));
                } catch (error) {
                    console.log('Image Not Found');
                }
                feature.imageUrl = `images/${req.file.filename}`;
            }
            await feature.save();

            req.flash('alertMessage', 'Success Update Feature');
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/items/show-detail-item/${itemId}/`);
        } catch (error) {
            console.log(error);
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/items/show-detail-item/${itemId}/`);
        }
    },
    destroyFeature: async (req, res) => {
        const { id, itemId } = req.params;
        try {
            const feature = await Feature.findOne({ _id: id });

            const item = await Item.findOne({ _id: itemId }).populate(
                'featureId'
            );
            for (let i = 0; i < item.featureId.length; i++) {
                if (
                    item.featureId[i]._id.toString() === feature._id.toString()
                ) {
                    item.featureId.pull({ _id: feature._id });
                    await item.save();
                }
            }
            await fs.unlink(path.join(`public/${feature.imageUrl}`));
            await feature.remove();
            req.flash('alertMessage', 'Success Delete Feature');
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/items/show-detail-item/${itemId}`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/items/show-detail-item/${itemId}`);
        }
    },
    addActivity: async (req, res) => {
        const { name, type, itemId } = req.body;

        try {
            if (!req.file) {
                req.flash('alertMessage', 'Image not found');
                req.flash('alertStatus', 'danger');
                res.redirect(`/admin/items/show-detail-item/${itemId}`);
            }
            const activity = await Activity.create({
                name,
                type,
                itemId,
                imageUrl: `images/${req.file.filename}`,
            });

            const item = await Item.findOne({ _id: itemId });
            item.activityId.push({ _id: activity._id });
            await item.save();
            req.flash('alertMessage', 'Success Add Activity');
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/items/show-detail-item/${itemId}`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/items/show-detail-item/${itemId}`);
        }
    },
    updateActivity: async (req, res) => {
        const { id, name, type, itemId } = req.body;
        try {
            const activity = await Activity.findOne({ _id: id });
            if (req.file == undefined) {
                activity.name = name;
                activity.type = type;
                await activity.save();
                req.flash('alertMessage', 'Success Update activity');
                req.flash('alertStatus', 'success');
                res.redirect(`/admin/items/show-detail-item/${itemId}`);
            } else {
                await fs.unlink(path.join(`public/${activity.imageUrl}`));
                activity.name = name;
                activity.type = type;
                activity.imageUrl = `images/${req.file.filename}`;
                await activity.save();
                req.flash('alertMessage', 'Success Update activity');
                req.flash('alertStatus', 'success');
                res.redirect(`/admin/items/show-detail-item/${itemId}`);
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/items/show-detail-item/${itemId}`);
        }
    },
    destroyActivity: async (req, res) => {
        const { id, itemId } = req.params;
        try {
            const activity = await Activity.findOne({ _id: id });

            const item = await Item.findOne({ _id: itemId }).populate(
                'activityId'
            );
            for (let i = 0; i < item.activityId.length; i++) {
                if (
                    item.activityId[i]._id.toString() ===
                    activity._id.toString()
                ) {
                    item.activityId.pull({ _id: activity._id });
                    await item.save();
                }
            }
            await fs.unlink(path.join(`public/${activity.imageUrl}`));
            await activity.remove();
            req.flash('alertMessage', 'Success Delete Activity');
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/items/show-detail-item/${itemId}`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/items/show-detail-item/${itemId}`);
        }
    },

    viewBooking: async (req, res) => {
        try {
            const booking = await Booking.find()
                .populate('memberId')
                .populate('bankId');

            res.render('admin/booking/view_booking', {
                title: 'Staycation | Booking',
                user: req.session.user,
                booking,
            });
        } catch (error) {
            res.redirect(`/admin/booking`);
        }
    },

    showDetailBooking: async (req, res) => {
        try {
            const { id } = req.params;
            const booking = await Booking.findOne({ _id: id })
                .populate('memberId')
                .populate('bankId');
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };

            res.render('admin/booking/detail_booking', {
                title: 'Staycation | Detail Booking',
                user: req.session.user,
                booking,
                alert,
            });
        } catch (error) {
            res.redirect('/admin/booking');
        }
    },

    actionConfirmation: async (req, res) => {
        const { id } = req.params;
        try {
            const booking = await Booking.findOne({ _id: id });
            booking.payments.status = 'Accept';
            await booking.save();
            req.flash('alertMessage', 'Success Confirmation Pembayaran');
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/booking/${id}`);
        } catch (error) {
            res.redirect(`/admin/booking/${id}`);
        }
    },

    actionReject: async (req, res) => {
        const { id } = req.params;
        try {
            const booking = await Booking.findOne({ _id: id });
            booking.payments.status = 'Reject';
            await booking.save();
            req.flash('alertMessage', 'Success Reject Pembayaran');
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/booking/${id}`);
        } catch (error) {
            res.redirect(`/admin/booking/${id}`);
        }
    },
};
