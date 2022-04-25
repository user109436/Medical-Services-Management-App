const mongoose = require('mongoose');
const Logger = require('../../utils/Logger');
const yearSchema = new mongoose.Schema({
    year: {
        type: String,
        trim: true,
        unique:true,
        required: [true, 'Year must have a Name']
    },
    log_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Log'
    }
});
//LOGGING
yearSchema.pre('save', async function (next) {
    const log = await Logger.create('Create New Year');
    this.log_id = log._id;
    next();
});
yearSchema.pre(/^findOneAndUpdate/, async function (next) {
    const log = await Logger.create('Update Year');
    this.log_id = log._id;
    next();
});
yearSchema.pre(/^findOneAndDelete/, async function (next) {
    const log = await Logger.create('Deleted Year');
    this.log_id = log._id;
    next();
});
module.exports = Year = mongoose.model('Year', yearSchema);
