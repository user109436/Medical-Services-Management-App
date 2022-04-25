const factory = require('./handlerFactory');
const Physician = require('../models/Users/physicianModel');
const MedicalRecord = require('../models/Medicals/medicalRecordModel');
const User = require('../models/Users/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getPhysicians = factory.getAll(Physician);
exports.getPhysician = factory.getOne(Physician);
exports.createPhysician = factory.createOne(Physician);
exports.updatePhysician = factory.updateOne(Physician);
exports.deletePhysician = factory.deleteOne(Physician);

exports.getActivities = catchAsync(async (req, res, next) => {
    const doc = await MedicalRecord.find({
        $or: [
            {
                physician_id: req.params.id
            }, {
                prescriptions: {
                    physician_id: req.params.id
                }
            }
        ]
    });
    res.status(200).json({
        status: 'success',
        length: doc.length,
        doc
    });
});

exports.updatePhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();
    req.body.photo = req.file.filename;
    const doc = await Physician.findByIdAndUpdate(req.params.id, { photo: req.body.photo }, { runValidators: false });
    const user = await User.findByIdAndUpdate(doc.user_id._id, { photo: req.body.photo }, { runValidators: false });
    if (!doc) {
        return res.status(400).json({
            status: 'fail',
            message: `Can't Update Document with that ID`
        });
    }
    res.status(200).json({
        status: 'success',
        doc
    })
});

exports.getPhysicianByUserId = catchAsync(async (req, res, next) => {
    const doc = await Physician.find({user_id:req.params.id});
    if (!doc) {
        return res.status(400).json({
            status: 'fail',
            message: `No Document found with that ID`
        });
    }
    res.status(200).json({
        status: 'success',
        doc
    });
});

exports.physicianHasReferences=catchAsync(async(req, res, next)=>{
    const data =await Physician.findOne({_id:req.params.id});
    if(!data){
        return res.status(400).json({
            status: 'fail',
            message: `Can't Delete document with that ID`
        });
    }
    //we can delete it if data is not yet assigned with user_id
    if(data.user_id){
     let medicalRecordCount=0, count=0;
     count = await User.count({_id:data.user_id._id});
     medicalRecordCount = await MedicalRecord.count({physician_id:data._id});
    return res.status(400).json({
        status:'success',
        message:`References: ${count} in User, ${medicalRecordCount} in Medical Records`
    })
    }
    next();


})