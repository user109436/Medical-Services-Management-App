const catchAsync= require('../utils/catchAsync');
const factory = require('./handlerFactory');
const Medicine = require('../models/Medicals/medicineModel');


exports.getMedicines=factory.getAll(Medicine);
exports.getMedicine=factory.getOne(Medicine);
exports.createMedicine=factory.createOne(Medicine);
exports.updateMedicine=factory.updateOne(Medicine);
exports.deleteMedicine=factory.deleteOne(Medicine);