const router = require('express').Router();
const apiController = require('../controllers/apiController');
const { uploadSingle } = require('../middleware/multer');

router.get('/landingpage', apiController.landingPage);
router.get('/detailpage/:id', apiController.detailPage);
router.post('/booking', uploadSingle, apiController.bookingPage);

module.exports = router;