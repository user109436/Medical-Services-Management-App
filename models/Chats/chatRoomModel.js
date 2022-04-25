const mongoose = require('mongoose');
const crypto = require('crypto')
const chatRoomSchema = new mongoose.Schema({
    roomName: {
        type: String,
        default: `Room-${crypto.randomBytes(6).toString('hex')}-${Date.now()}`
    },
    users: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ],
    lastMessage: {
        type: mongoose.Schema.ObjectId,
        ref: 'Chat'
    }
},
    {
        timestamps: true
    }
);
chatRoomSchema.pre(/^find/, async function (next) {
    this.populate({
        path: 'lastMessage',
        select: '-chatRoom'
    }).populate({
        path: 'users',
        // select: '_id email role, name, photo'
    });
    next();
})
module.exports = ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);
