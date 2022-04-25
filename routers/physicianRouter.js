const express = require('express');
const physicianController = require('../controllers/physicianController');
const authController = require('../controllers/authController');
const imgController = require('../controllers/imgController');
const router = express.Router();

router.use(authController.protect);
router.route('/user-id/:id')
    .get(physicianController.getPhysicianByUserId);
router.route('/:id')
    .get(physicianController.getPhysician);
router.route('/:id/activities')
    .get(physicianController.getActivities);
router.route('/:id/update-photo')
    .patch(
        imgController.uploadUserPhoto,
        imgController.formatUserPhoto,
        physicianController.updatePhoto
    )
router
    .route('/')
    .get(physicianController.getPhysicians)
router.use(authController.allowedRoles('encoder', 'admin', 'system'));
router
    .route('/')
    .post(physicianController.createPhysician);

router.route('/:id')
    .patch(physicianController.updatePhysician)
    .delete(
        physicianController.physicianHasReferences,
        physicianController.deletePhysician
    )
    .get(physicianController.getPhysician);
module.exports = router;