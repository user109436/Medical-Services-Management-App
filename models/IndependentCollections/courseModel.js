const mongoose = require('mongoose');
const Logger = require('../../utils/Logger');

const courseSchema = new mongoose.Schema({
    course: {
        type: String,
        trim: true,
        unique:true,
        required: [true, 'Course must have a Name']
    },
    course_code: {
        type: String,
        trim: true,
        unique:true,
        required: [true, 'Course must have a Code']
    },
    log_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Log'
    }
});
//LOGGING
courseSchema.pre('save', async function (next) {
    const log = await Logger.create('Create New Course');
    this.log_id = log._id;
    next();
});
courseSchema.pre(/^findOneAndUpdate/, async function (next) {
    const log = await Logger.create('Update Course');
    this.log_id = log._id;
    next();
});
courseSchema.pre(/^findOneAndDelete/, async function (next) {
    const log = await Logger.create('Deleted Course');
    this.log_id = log._id;
    next();
});
module.exports = Course = mongoose.model('Course', courseSchema);
