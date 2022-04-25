const express = require('express');
const medicalRecordController = require('../controllers/medicalRecordController');
const authController = require('../controllers/authController');
const router = express.Router();

router.route('/verify/:verificationToken')
    .get(medicalRecordController.verifyMedicalRecord);

router.route('/:id/prescriptions')
    .get(medicalRecordController.getPrescriptions);//TODO:list all prescriptions UI
router.route('/:id/prescriptions/:prescription_id/export')
    .get(medicalRecordController.exportPrescriptionRecord);//TODO:list all prescriptions UI

router.route('/:id/laboratories')
    .get(medicalRecordController.getLaboratories);;//TODO:list all pictures from Chats/Convo UI

router.route('/:id/patient-info')
    .get(medicalRecordController.getPatientInfo);;//TODO: list patient info UI
router.route('/user/:id')
    .get(
        medicalRecordController.getMedicalRecordByUserId
    )
router.route('/:id/export').get(
    // authController.allowedRoles('dentist', 'doctor', 'admin', 'system'), //temporarily removed
    medicalRecordController.exportMedicalRecord
);
router.route('/:id') //for public view
    .get(
        medicalRecordController.getMedicalRecord
    );
router.use(authController.protect);




//NOTE:Medical Record of a Person is Viewable to All But Only Downloadable to Doctors
router.route('/')
    .get(
        authController.allowedRoles('nurse', 'dentist', 'doctor', 'admin', 'system'),
        medicalRecordController.getMedicalRecords
    )
    .post(
        authController.allowedRoles('nurse', 'dentist', 'doctor', 'admin', 'system'),
        medicalRecordController.createMedicalRecord
    );


router.route('/:id')
    .patch(
        authController.allowedRoles('nurse', 'dentist', 'doctor', 'admin', 'system'),
        medicalRecordController.updateMedicalRecord
    )
    .delete(
        authController.allowedRoles('nurse', 'dentist', 'doctor', 'admin', 'system'),
        medicalRecordController.deleteMedicalRecord
    )


module.exports = router;