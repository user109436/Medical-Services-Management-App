

const mongoose = require('mongoose');
const Logger = require('../../utils/Logger');

const physicianSchema = new mongoose.Schema({
    name: {
        firstname: {
            type: String,
            required: [true, 'Physician must have First Name'],
            trim: true,
            maxlength: [50, "First Name must not exceed 50 characters"],
            minlength: [2, "First Name must atleast have 2 characters "],
            validate: [/^[a-zA-Z\s]*$/, 'First Name should only contain characters']
        },
        middlename: {
            type: String,
            trim: true,
            maxlength: [50, "Middle Name must not exceed 50 characters"],
            validate: [/^[a-zA-Z\s]*$/, 'Middle Name/Initial should only contain characters']
        },
        lastname: {
            type: String,
            required: [true, 'Physician must have Last Name'],
            trim: true,
            maxlength: [50, "Last Name must not exceed 50 characters"],
            minlength: [2, "Last Name must atleast have 2 characters "],
            validate: [/^[a-zA-Z\s]*$/, 'Last Name should only contain characters']
        },
        suffix: {
            type: String,
            trim: true,
            maxlength: [50, "Suffix must not exceed 50 characters"],
            validate: [/^[a-zA-Z\s]*$/, 'Suffix should only contain characters']
        },
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    prc_license: {
        type: String,
        trim: true,
        required: [true, 'Physician must have a license']
    },
    ptr_no: {
        type: String,
        trim: true,
    },
    details: {
        type: String,
        trim: true,
    },user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    log_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Log'
    }

});

//LOGGING
physicianSchema.pre('save', async function (next) {
    const log = await Logger.create('Create New Physician');
    this.log_id = log._id;
    next();
});
physicianSchema.pre(/^findOneAndUpdate/, async function (next) {
    const log = await Logger.create('Update Physician');
    this.log_id = log._id;
    next();
});
physicianSchema.pre(/^findOneAndDelete/, async function (next) {
    const log = await Logger.create('Deleted Physician');
    this.log_id = log._id;
    next();
});
physicianSchema.pre(/^find/, async function (next) {
    this.populate({
        path:'user_id',
    }).populate({
        path:'log_id'
    });
    next();
})

module.exports = Physician = mongoose.model('Physician', physicianSchema);