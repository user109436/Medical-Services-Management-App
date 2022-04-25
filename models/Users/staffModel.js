

const mongoose = require('mongoose');
const crypto  =require('crypto');
const Logger = require('../../utils/Logger');

const staffSchema = new mongoose.Schema({
    employee_no: {
        type: String,
        required: [true, 'Must have an employee no.']
    },
    department_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Department',
        required: [true, 'Staff must have a department or an office']
    },
    name: {
        firstname: {
            type: String,
            required: [true, 'Staff/Faculty must have First Name'],
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
            required: [true, 'Staff/Faculty must have Last Name'],
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
    sex: {
        type: String,
        enum: ['male', 'female'],
        default: 'male'
    },
    birthday: {
        type: Date
    },
    age: {
        type: Number,
        min: 1,
        default: 1
    },
    civil_status: {
        type: String
    },
    religion: {
        type: String
    },
    address: [{
        id: {
            type: String,
            default:crypto.randomBytes(32).toString('hex')

        },
        house_number: {
            type: String //ex.123 ,blk floor subdivision number
        },
        street: {
            type: String //ex.  T. Claudio St. street/subdivision name
        },
        barangay: {
            type: String //ex. Santiago
        },
        municipality: {
            type: String //ex. Morong
        },
        city_province: {
            type: String //ex. Rizal
        }
    }],
    contact: [{
        id: {
            type: String,
            default:crypto.randomBytes(32).toString('hex')

        },
        contact: String
    }],
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    log_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Log'
    }

});
//LOGGING
staffSchema.pre('save', async function (next) {
    const log = await Logger.create('Create New Staff');
    this.log_id = log._id;
    next();
});
staffSchema.pre(/^findOneAndUpdate/, async function (next) {
    const log = await Logger.create('Update Staff');
    this.log_id = log._id;
    next();
});
staffSchema.pre(/^findOneAndDelete/, async function (next) {
    const log = await Logger.create('Deleted Staff');
    this.log_id = log._id;
    next();
});

//fetch department
staffSchema.pre(/^find/, async function (next) {
    this.populate({
        path: 'department_id'
    }).populate({
        path:'user_id',
    }).populate({
        path:'log_id'
    });
    next();
})
module.exports = Staff = mongoose.model('Staff', staffSchema);