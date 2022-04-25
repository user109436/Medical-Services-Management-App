const express = require('express');
const staffController = require('../controllers/staffController');
const authController = require('../controllers/authController');
const router = express.Router();

router.use(authController.protect);
router.route('/:id')
    .get(staffController.getStaff);
router
    .route('/')
    .get(staffController.getStaffs)
router.use(authController.allowedRoles('encoder', 'admin', 'system'));
router
    .route('/')
    .post(staffController.createStaff);

router.route('/:id')
    .patch(staffController.updateStaff)
    .delete(
        staffController.staffHasReferences,
        staffController.deleteStaff
    )
    .get(staffController.getStaff);
module.exports = router;