const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();


router.post('/signup', authController.signup);
router.post('/signup/resend-email-verification', authController.resendEmailVerification);
router.get('/signup/verify/:verificationToken', authController.verifyEmail);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.use(authController.protect);//for authenticated users only
router.patch('/update-password', authController.updatePassword);


module.exports =router;