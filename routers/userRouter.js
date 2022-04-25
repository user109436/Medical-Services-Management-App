const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const imgController = require('../controllers/imgController');
const router = express.Router();
//TODO:upload profile picture
//TODO:update details about me
//NOTE: Encoder can only Add & View User Accounts for this part
router.route('/identify-user-type')//will use jwt token to identify user
    .post(
        userController.getUserByRole
    )

router.route('/update-photo/:id')
.patch(
    imgController.uploadUserPhoto,
    imgController.formatUserPhoto,
    userController.updateMultipleTypeOfUser
    )
router.use(authController.protect);
router.route('/update-info/:id')
.patch(
    userController.updateMultipleTypeOfUser
    )
router.route('/get-user-data')//will use req.body to identify user
    .post(
        userController.getUserData
    )
router.route('/')
    .get(
        authController.allowedRoles('nurse', 'dentist', 'doctor', 'encoder', 'admin', 'system'),
        userController.getUsers
    )
    .post(
        authController.allowedRoles('encoder', 'admin', 'system'),
        userController.createUser
    );


router.route('/:id')
    .patch(
        authController.allowedRoles('admin', 'system'),
        userController.updateUser
    )
    .delete(
        authController.allowedRoles('admin', 'system'),
        userController.userHasReferences,
        userController.deleteUser
    )
    .get(
        authController.allowedRoles('encoder', 'admin', 'system'),
        userController.getUser
    );

module.exports = router;