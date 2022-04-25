const express = require('express');
const studentController = require('../controllers/studentController');
const authController = require('../controllers/authController');
const router = express.Router();

router.use(authController.protect);
router.route('/:id')
    .get(studentController.getStudent);
router
    .route('/')
    .get(studentController.getStudents)
router.use(authController.allowedRoles('encoder', 'admin', 'system'));
router
    .route('/')
    .post(studentController.createStudent);

router.route('/:id')
    .patch(studentController.updateStudent)
    .delete(
        studentController.studentHasReferences,
        studentController.deleteStudent)
    .get(studentController.getStudent);
module.exports = router;