const factory = require('./handlerFactory');
const Staff = require('../models/Users/staffModel');
const User = require('../models/Users/userModel');
const catchAsync = require('../utils/catchAsync');



exports.getStaffs=factory.getAll(Staff);
exports.getStaff=factory.getOne(Staff);
exports.createStaff=factory.createOne(Staff);
exports.updateStaff=factory.updateOne(Staff);
exports.deleteStaff=factory.deleteOne(Staff);
exports.staffHasReferences=catchAsync(async(req, res, next)=>{
    const data =await Staff.findOne({_id:req.params.id});
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