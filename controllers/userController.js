const { promisify } = require('util');
const factory = require('./handlerFactory');
const User = require('../models/Users/userModel');
const Student = require('../models/Users/studentModel');
const Staff = require('../models/Users/staffModel');
const Physician = require('../models/Users/physicianModel');
const MedicalRecord = require('../models/Medicals/medicalRecordModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;

exports.getUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.getUserByRole = catchAsync(async (req, res, next) => {
    //verify token
    const decoded = await (promisify(jwt.verify)(req.body.token, process.env.JWT_SECRET));
    const staffs = ['faculty', 'non-faculty', 'encoder', 'admin'];
    const physicians = ['nurse', 'dentist', 'doctor'];
    let { role, id } = decoded; //id = _id of User Model
    id = ObjectId(id);
    let doc;
    if (role === 'student') {
        doc = await Student.findOne({ user_id: id });
    } else if (staffs.includes(role)) {
        doc = await Staff.findOne({ user_id: id });
    } else if (physicians.includes(role)) {
        doc = await Physician.findOne({ user_id: id });
    }
    if(!doc){
        //log out user
        return res.status(401).json({
            status: 'fail',
            message:"Token Malformed"
        });
    }
    return res.status(200).json({
        status: 'success',
        doc
    });
});
exports.getUserData=catchAsync(async(req, res, next)=>{
    
    const staffs = ['faculty', 'non-faculty', 'encoder', 'admin'];
    const physicians = ['nurse', 'dentist', 'doctor'];
    let { role, _id } = req.body; //id = _id of User Model
   let id = ObjectId(_id);
    let doc;
    if (role === 'student') {
        doc = await Student.findOne({ user_id: id });
    } else if (staffs.includes(role)) {
        doc = await Staff.findOne({ user_id: id });
    } else if (physicians.includes(role)) {
        doc = await Physician.findOne({ user_id: id });
    }
    // console.log(doc);
    if(!doc){
        //log out user
        return res.status(400).json({
            status: 'fail',
            message:"Failed to find Document with that ID"
        });
    }
    return res.status(200).json({
        status: 'success',
        doc
    });
})
exports.updateMultipleTypeOfUser=catchAsync(async(req, res, next)=>{
    //update user photo in USERMODEL
    if (req.file){
        req.body.photo = req.file.filename;
    }
    let id = req.params.id;
    const user = await User.findByIdAndUpdate(id, req.body, { runValidators: false });
    if(!user){
        return res.status(400).json({
            status: 'fail',
            message: `Can't Update Document with that ID`
        });
    }
    const staffs=['faculty', 'non-faculty', 'admin', 'encoder'];
    const physicians=['nurse', 'dentist', 'doctor'];

    // identify user & update user photo in their respective MODEL
    let doc;
    if(user.role.includes('student')){
        doc=await Student.findOneAndUpdate({user_id:id}, req.body);
    }else if(staffs.includes(user.role)){
        doc=await Staff.findOneAndUpdate({user_id:id}, req.body);
    }else if(physicians.includes(user.role)){
        doc=await Physician.findOneAndUpdate({user_id:id}, req.body);
    }
    return res.status(200).json({
        status:'success',
        length:doc.length,
        doc
    })

})

exports.userHasReferences=catchAsync(async(req, res, next)=>{
    const data =await User.findOne({_id:req.params.id});
    if(!data){
        return res.status(400).json({
            status: 'fail',
            message: `Can't Delete document with that ID`
        });
    }
    let count = await identifyUserType(data, req.params.id);
    if(count){
        let medicalRecordCount=0
        medicalRecordCount = await MedicalRecord.count({user_id:req.params.id});
        return res.status(400).json({
            status:'success',
            message:`References: ${count} in User, ${medicalRecordCount} in Medical Records`
        })
    }
    next();
   


})
const identifyUserType=async(user, id)=>{
    let count=false;
    const staffs=['faculty', 'non-faculty', 'admin', 'encoder'];
    const physicians=['nurse', 'dentist', 'doctor'];
    if(user.role.includes('student')){
        count= await Student.count({user_id:id});
    }else if(staffs.includes(user.role)){
        count= await Staff.count({user_id:id});
    }else if(physicians.includes(user.role)){
        count= await Physician.count({user_id:id});
    }
    return count;
}