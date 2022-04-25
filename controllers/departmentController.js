const factory = require('./handlerFactory');
const Department = require('../models/IndependentCollections/departmentModel');
const Staff = require('../models/Users/staffModel');
const catchAsync = require('../utils/catchAsync');


exports.getDepartments=factory.getAll(Department);
exports.getDepartment=factory.getOne(Department);
exports.createDepartment=factory.createOne(Department);
exports.updateDepartment=factory.updateOne(Department);
exports.deleteDepartment=factory.deleteOne(Department);
exports.departmentHasReferences = catchAsync(async(req, res, next)=>{
    //count all student that has this course_id
    const count = await  Staff.count({department_id:req.params.id});
    if(count){
        return res.status(400).json({
            status:'success',
            message:`Could not delete because it has ${count} references`
        })
    }
    //will delete from the next middleware
    next();
})