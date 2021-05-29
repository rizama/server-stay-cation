const router = require('express').Router();
const apiController = require('../controllers/apiController');
const { uploadSingle, uploadMultiple } = require('../middleware/multer');

router.get('/landingpage', apiController.landingPage);
router.get('/detailpage/:id', apiController.detailPage);

module.exports = router;