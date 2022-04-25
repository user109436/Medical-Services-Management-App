const mongoose = require('mongoose');
const Logger = require('../../utils/Logger');

const sectionSchema = new mongoose.Schema({
    section: {
        type: String,
        trim: true,
        required: [true, 'Section must have a Name'],
        unique:true
    },
    log_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Log'
    }
});
//LOGGING
sectionSchema.pre('save', async function (next) {
    const log = await Logger.create('Create New Section');
    this.log_id = log._id;
    next();
});
sectionSchema.pre(/^findOneAndUpdate/, async function (next) {
    const log = await Logger.create('Update Section');
    this.log_id = log._id;
    next();
});
sectionSchema.pre(/^findOneAndDelete/, async function (next) {
    const log = await Logger.create('Deleted Section');
    this.log_id = log._id;
    next();
});
module.exports = Section = mongoose.model('Section', sectionSchema);
