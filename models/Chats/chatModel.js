
/*
This Chat Model uses recipients user_id to send and retrieve chats:
recipient id can be found in : req.params.id (/api/chats/:id)
sender id can be found in : res.locals.id 
1.Message -not required because client/doctor may just want to send/upload file
2.Files(Image -PDF is subject for scaling the app) 
*/
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    chatRoom: {
        type: mongoose.Schema.ObjectId,
        ref: "ChatRoom"
    },
    message: {
        type: String,
        trim: true
    },
    files: [String],
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Message must have a sender']
    },
    seenBy: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }]
},
    {
        timestamps: true
    }

);

chatSchema.pre(/^find/, async function (next) {
    this.populate({
        path: 'chatRoom',
    }).populate({
        path: 'sender',
        // select:'_id email role, name, photo'
    })
    next();
})

module.exports = Chat = mongoose.model('Chat', chatSchema);