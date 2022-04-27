const catchAsync = require('../utils/catchAsync');
const Logger = require('../utils/Logger');
const User = require('../models/Users/userModel');

//delete
exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    Logger.createIdLogFile('./', res.locals.user._id)
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
        return res.status(400).json({
            status: 'fail',
            message: `Can't Delete document with that ID`
        });
    }
    res.status(204).json({
        status: 'success',
        message: "Succesfully Deleted"
    });
});

exports.createOne = Model => catchAsync(async (req, res, next) => {
    Logger.createIdLogFile('./', res.locals.user._id)
    const doc = await Model.create(req.body);
    if(req.body?.name||req.body?.photo){//insert name and photo if new user is created(staff, student & physician)
        let data={}
        if(req.body.photo){
            data.photo=req.body.photo;
        }
        if(req.body.name){
            data.name= req.body.name;
        }
        await User.findByIdAndUpdate(req.body.user_id, data);
    }
    if (!doc) {
        return res.status(400).json({
            status: 'fail',
            message: "Document Creation Failed, Please Try Again Later"
        });
    }
    res.status(200).json({
        status: "success",
        doc
    });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    Logger.createIdLogFile('./', res.locals.user._id);
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    }).sort({ _id: -1 });
    if(req.body?.name||req.body?.photo){//update name and photo if existing user is updated(staff, student & physician)
        let data={}
        if(req.body.photo){
            data.photo=req.body.photo;
        }
        if(req.body.name){
            data.name= req.body.name;
        }
        await User.findByIdAndUpdate(req.body.user_id, data);
    }
    if (!doc) {
        return res.status(400).json({
            status: 'fail',
            message: `Can't Update Document with that ID`
        });
    }
    res.status(201).json({
        status: 'success',
        doc
    });

});
exports.getOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
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
exports.getAll = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.find({ role: { $ne: "system" } }).sort({ _id: -1 });
    res.status(200).json({
        status: 'success',
        length: doc.length,
        doc
    });
});

