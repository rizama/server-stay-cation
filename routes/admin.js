const router = require('express').Router();
const adminController = require("../controllers/adminController");

// Dashboard
router.get('/dashboard', adminController.viewDashboard);

// Category
router.get('/categories', adminController.viewCategory);
router.post('/categories', adminController.storeCategory);
router.put('/categories', adminController.updateCategory);
router.delete('/categories/:id', adminController.destroyCategory);

router.get('/bank', adminController.viewBank);
router.get('/items', adminController.viewItem);
router.get('/booking', adminController.viewBooking);

module.exports = router;