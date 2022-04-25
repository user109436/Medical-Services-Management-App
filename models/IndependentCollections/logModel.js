const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    activity:{
        type:String,
        trim:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});
logSchema.pre(/^find/, async function (next) {
    this.populate({
        path: 'user_id',
        select:'-log_id name role'
    })
    next();
})
module.exports = Log = mongoose.model('Log', logSchema);