

const mongoose = require('mongoose');
const crypto  =require('crypto');
const Logger = require('../../utils/Logger');

const studentSchema = new mongoose.Schema({
    student_no: {
        type: String,
        required: [true, 'Must have a student no.']
    },
    year_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Year'
        // required: [true, 'Student must have a Year Level']
    },
    section_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Section'
        // required: [true, 'Student must have a Section']

    },
    course_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: [true, 'Student must have a Course']

    },
    name: {
        firstname: {
            type: String,
            required: [true, 'Student must have First Name'],
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
            required: [true, 'Student must have Last Name'],
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
studentSchema.pre('save', async function (next) {
    const log = await Logger.create('Create New Student');
    this.log_id = log._id;
    next();
});
studentSchema.pre(/^findOneAndUpdate/, async function (next) {
    const log = await Logger.create('Update Student');
    this.log_id = log._id;
    next();
});
studentSchema.pre(/^findOneAndDelete/, async function (next) {
    const log = await Logger.create('Deleted Student');
    this.log_id = log._id;
    next();
});

//fetch course, section, year
studentSchema.pre(/^find/, async function (next) {
    this.populate({
        path: 'section_id',
    }).populate({
        path: 'course_id',
    }).populate({
        path: 'year_id'
    }).populate({
        path:'user_id',
    }).populate({
        path:'log_id'
    })
    next();
})

module.exports = Student = mongoose.model('Student', studentSchema);