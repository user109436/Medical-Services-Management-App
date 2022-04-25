const express = require('express');
const courseController = require('../controllers/courseController');
const authController = require('../controllers/authController');
const router = express.Router();
router
    .route('/')
    .get(courseController.getCourses)
    router.use(authController.protect);
    router.use(authController.allowedRoles('encoder', 'admin', 'system'));
router
    .route('/')
    .post(courseController.createCourse);

router.route('/:id')
    .patch(courseController.updateCourse)
    .delete(
        courseController.courseHasReferences,
        courseController.deleteCourse
    )
    .get(courseController.getCourse);
module.exports = router;