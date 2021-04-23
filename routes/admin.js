const router = require('express').Router();
const adminController = require('../controllers/adminController');
const { uploadSingle } = require('../middleware/multer');

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

router.get('/items', adminController.viewItem);
router.get('/booking', adminController.viewBooking);

module.exports = router;
