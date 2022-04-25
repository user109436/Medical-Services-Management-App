const mongoose = require('mongoose');
const Logger = require('../../utils/Logger');
// TODO: always insert any activity on log before doing any queries 
const departmentSchema = new mongoose.Schema({
    department: {
        type: String,
        required: [true, 'Departmnet/Office/Faculty must have a name'],
        trim: true,
        unique:true
    },
    details: {
        type: String,
        trim: true
    },
    log_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Log'
    }
});
//LOGGING
departmentSchema.pre('save', async function (next) {
    const log = await Logger.create('Create New Department');
    this.log_id = log._id;
    next();
});
departmentSchema.pre(/^findOneAndUpdate/, async function (next) {
    const log = await Logger.create('Update Department');
    this.log_id = log._id;
    next();
});
departmentSchema.pre(/^findOneAndDelete/, async function (next) {
    const log = await Logger.create('Deleted Department');
    this.log_id = log._id;
    next();
});
module.exports = Department = mongoose.model('Department', departmentSchema);