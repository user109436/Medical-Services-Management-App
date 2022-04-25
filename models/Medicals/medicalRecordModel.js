const mongoose = require('mongoose');
const crypto = require('crypto');
const Logger = require('../../utils/Logger');

const medicalRecordSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    physician_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Physician'
    },
    symptoms: [{
        id: {
            type: String,
            default: crypto.randomBytes(32).toString('hex')
        },
        symptom: {
            type: String
        }
    }],
    diagnosis: [{
        id: {
            type: String,
            default: crypto.randomBytes(32).toString('hex')
        },
        diagnose: {
            type: String
        }
    }],
    laboratories: [
        {
            id: {
                type: String,
                default: crypto.randomBytes(32).toString('hex')
            },
            laboratory: {
                type: String
            }
        }
    ],
    prescriptions: [{
        id: {
            type: String,
            default: crypto.randomBytes(32).toString('hex')
        },
        medicine: [{
            id: {
                type: String,
                default: crypto.randomBytes(32).toString('hex')
            },
            details: {
                type: String,
                trim: true
            }
        }],
        physician_id: {
            type: mongoose.Schema.ObjectId,
            ref: 'Physician'
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }],
    verificationToken: String,
    log_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Log'
    }
},
    {
        timestamps: true
    }

);
medicalRecordSchema.pre('save', async function (next) {
    const token = crypto.randomBytes(32).toString('hex');
    this.verificationToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
    //log save
    next();
});
medicalRecordSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user_id',
        select: '_id role name photo'
    }).populate({
        path: 'physician_id'
    }).populate({
        path: 'prescriptions.physician_id'
    }).populate({
        path: 'prescriptions.medicine.id'
    }).populate({
        path: 'log_id'
    });
    next();
});
//LOGGING
medicalRecordSchema.pre('save', async function (next) {
    const log = await Logger.create('Create New Medical Record');
    this.log_id = log._id;
    next();
});
medicalRecordSchema.pre(/^findOneAndUpdate/, async function (next) {
    const log = await Logger.create('Update Medical Record');
    this.log_id = log._id;
    next();
});
medicalRecordSchema.pre(/^findOneAndDelete/, async function (next) {
    const log = await Logger.create('Deleted Medical Record');
    this.log_id = log._id;
    next();
});
const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);
module.exports = MedicalRecord;