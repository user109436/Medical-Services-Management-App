const Log = require('../models/IndependentCollections/logModel');
const fs = require('fs');
//
exports.createIdLogFile=(path,user_id)=>{
    user_id = user_id?user_id.toString():"5c8a201e2f8fb814b56fa155";
    return fs.writeFileSync(`${path}/logId.txt`, user_id);
}
exports.create = async function (activity, logFolder = './logId.txt') {
    const user_id = fs.readFileSync(logFolder,'utf-8');
    console.log(user_id, activity);
    try {
        const log = await Log.create({ user_id, activity });
        if (!log) {
            return 'Error Logging for Save';
        }
        return log;
    } catch (err) {
        console.log(err);
    }
}