const express = require('express');
const logController = require('../controllers/logController');
const authController = require('../controllers/authController');
const router = express.Router();

router.use(authController.protect);
router
    .route('/')
    .get(logController.getLogs)
    
module.exports = router;