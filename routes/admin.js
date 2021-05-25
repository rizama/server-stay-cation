const router = require('express').Router();
const adminController = require('../controllers/adminController');
const { uploadSingle, uploadMultiple } = require('../middleware/multer');
const auth = require('../middleware/auth');

// Login
router.get('/login', adminController.viewLogin);
router.post('/login', adminController.loginAction);
router.get('/logout', adminController.logoutAction);


router.use(auth);

// Dashboard
router.get('/dashboard', adminController.viewDashboard);

// Category
router.get('/categories', adminController.viewCategory);
router.post('/categories', adminController.storeCategory);
router.put('/categories', adminController.updateCategory);
router.delete('/categories/:id', adminController.destroyCategory);

router.get('/bank', adminController.viewBank);
router.post('/bank', uploadSingle, adminController.storeBank);
router.put('/bank', uploadSingle, adminController.updateBank);
router.delete('/bank/:id', adminController.destroyBank);

router.get('/items', adminController.viewItem);
router.post('/items', uploadMultiple, adminController.storeItem);
router.get('/items/show-images/:id', adminController.showImageItem);
router.get('/items/:id', uploadMultiple, adminController.showEditItem);
router.put('/items/:id', uploadMultiple, adminController.updateItem);
router.delete('/items/:id/delete', adminController.destroyItem);

router.get('/items/show-detail-item/:itemId', adminController.viewDetailItem);
router.post('/items/add-feature', uploadSingle, adminController.addFeature);
router.put(
    '/items/update/feature',
    uploadSingle,
    adminController.updateFeature
);
router.delete(
    '/items/:itemId/feature/:id/delete',
    adminController.destroyFeature
);

router.post('/items/add-activity', uploadSingle, adminController.addActivity);
router.put(
    '/items/update/activity',
    uploadSingle,
    adminController.updateActivity
);
router.delete(
    '/items/:itemId/activity/:id/delete',
    adminController.destroyActivity
);

router.get('/booking', adminController.viewBooking);
router.get('/booking/:id', adminController.showDetailBooking);

module.exports = router;
