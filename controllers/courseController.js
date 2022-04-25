const factory = require('./handlerFactory');
const Course = require('../models/IndependentCollections/courseModel');
const Student = require('../models/Users/studentModel');
const catchAsync = require('../utils/catchAsync');


exports.getCourses=factory.getAll(Course);
exports.getCourse=factory.getOne(Course);
exports.createCourse=factory.createOne(Course);
exports.updateCourse=factory.updateOne(Course);
exports.deleteCourse=factory.deleteOne(Course);
exports.courseHasReferences = catchAsync(async(req, res, next)=>{
    //count all student that has this course_id
    const count = await  Student.count({course_id:req.params.id});
    if(count){
        return res.status(400).json({
            status:'success',
            message:`Could not delete because it has ${count} references`
        })
    }
    //will delete from the next middleware
    next();
})