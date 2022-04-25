const express = require('express');
const imgController = require('../controllers/imgController');
const authController = require('../controllers/authController');
const router = express.Router();

// router.use(authController.protect);
router
    .route('/:key')
    .get(imgController.getFileFromAWS);
module.exports = router;