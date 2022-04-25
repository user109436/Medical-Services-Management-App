const express = require('express');
const sectionController = require('../controllers/sectionController');
const authController = require('../controllers/authController');
const router = express.Router();
router
    .route('/')
    .get(sectionController.getSections)
    router.use(authController.protect);
    router.use(authController.allowedRoles('encoder', 'admin', 'system'));
router
    .route('/')
    .post(sectionController.createSection);

router.route('/:id')
    .patch(sectionController.updateSection)
    .delete(sectionController.deleteSection)
    .get(sectionController.getSection);
module.exports = router;