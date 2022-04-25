const factory = require('./handlerFactory');
const Year = require('../models/IndependentCollections/yearModel');


exports.getYears=factory.getAll(Year);
exports.getYear=factory.getOne(Year);
exports.createYear=factory.createOne(Year);
exports.updateYear=factory.updateOne(Year);
exports.deleteYear=factory.deleteOne(Year);