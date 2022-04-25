const express = require('express');
const departmentController = require('../controllers/departmentController');
const authController = require('../controllers/authController');
const router = express.Router();
router
    .route('/')
    .get(departmentController.getDepartments)
    router.use(authController.protect);
    router.use(authController.allowedRoles('encoder', 'admin', 'system'));
router
    .route('/')
    .post(departmentController.createDepartment);

router.route('/:id')
    .patch(departmentController.updateDepartment)
    .delete(
        departmentController.departmentHasReferences,
        departmentController.deleteDepartment
    )
    .get(departmentController.getDepartment);
module.exports = router;