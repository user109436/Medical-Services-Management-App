const factory = require('./handlerFactory');
const Student = require('../models/Users/studentModel');
const User = require('../models/Users/userModel');
const catchAsync = require('../utils/catchAsync');



exports.getStudents=factory.getAll(Student);
exports.getStudent=factory.getOne(Student);
exports.createStudent=factory.createOne(Student);
exports.updateStudent=factory.updateOne(Student);
exports.deleteStudent=factory.deleteOne(Student);
exports.studentHasReferences=catchAsync(async(req, res, next)=>{
    const data =await Student.findOne({_id:req.params.id});
    if(!data){
        return res.status(400).json({
            status: 'fail',
            message: `Can't Delete document with that ID`
        });
    }
    //we can delete it if data is not yet assigned with user_id
    if(data.user_id){
    const count = await User.count({_id:data.user_id._id});
    return res.status(400).json({
        status:'success',
        message:`Could not delete because it has ${count} reference(s)`
    })
    }
    next();


})