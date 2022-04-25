const express = require('express');
const yearController = require('../controllers/yearController');
const authController = require('../controllers/authController');
const router = express.Router();
router
    .route('/')
    .get(yearController.getYears)
    router.use(authController.protect);
    router.use(authController.allowedRoles('encoder', 'admin', 'system'));
router
    .route('/')
    .post(yearController.createYear);

router.route('/:id')
    .patch(yearController.updateYear)
    .delete(yearController.deleteYear)
    .get(yearController.getYear);
module.exports = router;