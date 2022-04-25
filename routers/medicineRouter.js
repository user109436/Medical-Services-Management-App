const express = require('express');
const medicineController = require('../controllers/medicineController');
const authController= require('../controllers/authController');
const router = express.Router();
router.use(authController.protect);
router.use(authController.allowedRoles('nurse','dentist','doctor','encoder', 'admin','system'));
router
.route('/')
.get(medicineController.getMedicines)
.post(medicineController.createMedicine);

router.route('/:id')
.patch(medicineController.updateMedicine)
.delete(medicineController.deleteMedicine)
.get(medicineController.getMedicine);
module.exports=router;  