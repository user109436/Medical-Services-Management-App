const factory = require('./handlerFactory');
const Section = require('../models/IndependentCollections/sectionModel');


exports.getSections=factory.getAll(Section);
exports.getSection=factory.getOne(Section);
exports.createSection=factory.createOne(Section);
exports.updateSection=factory.updateOne(Section);
exports.deleteSection=factory.deleteOne(Section);