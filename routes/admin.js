const router = require('express').Router();
const adminController = require("../controllers/adminController");

router.get('/dashboard', adminController.viewDashboard);
router.get('/categories', adminController.viewCategory);
router.get('/bank', adminController.viewBank);
router.get('/items', adminController.viewItem);
router.get('/booking', adminController.viewBooking);

module.exports = router;