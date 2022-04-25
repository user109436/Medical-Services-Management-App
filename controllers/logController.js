const factory = require('./handlerFactory');
const Log = require('../models/IndependentCollections/logModel');


exports.getLogs=factory.getAll(Log);