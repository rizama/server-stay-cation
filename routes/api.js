const router = require('express').Router();
const apiController = require('../controllers/apiController');
const { uploadSingle, uploadMultiple } = require('../middleware/multer');

router.get('/landingpage', apiController.landingPage);

module.exports = router;