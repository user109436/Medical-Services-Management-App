const mongoose = require('mongoose');
const Logger = require('../../utils/Logger');

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Medicine must have a name'],
        minlength: [2, 'Medicine Name must be minimum of 2 Characters'],
        maxlength: [400, 'Medicine Name must not exceed 400 Characters'],
        trim: true

    },
    brand: {
        type: String,
        minlength: [2, ' Medicine Brand Name must be minimum of 2 Characters'],
        maxlength: [100, 'Medicine Brand Name must not exceed 100 Characters'],
        trim: true
    },
    log_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Log'
    }
});

//LOGGING
medicineSchema.pre('save', async function (next) {
    const log = await Logger.create('Create New Medicine');
    this.log_id = log._id;
    next();
});
medicineSchema.pre(/^findOneAndUpdate/, async function (next) {
    const log = await Logger.create('Update Medicine');
    this.log_id = log._id;
    next();
});
medicineSchema.pre(/^findOneAndDelete/, async function (next) {
    const log = await Logger.create('Deleted Medicine');
    this.log_id = log._id;
    next();
});
module.exports = Medicine = mongoose.model('Medicine', medicineSchema);