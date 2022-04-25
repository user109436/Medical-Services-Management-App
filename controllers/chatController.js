const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const Chat = require('../models/Chats/chatModel');
const ChatRoom = require('../models/Chats/chatRoomModel');
const User = require('../models/Users/userModel');
const mongoose = require('mongoose');
const sharp = require('sharp');
const multer = require('multer');
const multerStorage = multer.memoryStorage();
const { uploadFile } = require('./s3Controller');
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(res.status(404).json({ message: 'Not An Image' }), false)
    }

}
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 3 * 1024 * 1024 } //3MB
});

exports.uploadConvoImages = upload.fields([{ name: 'images', maxCount: 10 }]);
upload.array('images', 10); //this is neccessary

exports.resizeConvoImages = catchAsync(async (req, res, next) => {
    if (!req.files.images) return next();
    req.body.images = [];
    await Promise.all(
        req.files.images.map(async (file, i) => {
            const filename = `chatRoomId-${req.params.id}-from-${res.locals.user._id}-${Date.now()}-${i + 1}.jpeg`;
            file.filename = `chatRoomId-${req.params.id}-from-${res.locals.user._id}-${Date.now()}-${i + 1}.jpeg`;
            await sharp(file.buffer)
                .toFormat('jpeg')
                .jpeg({ quality: 90 });
                // .toFile(`client/public/assets/img/chats/${filename}`);
                //- we will save our file to AWS server (s3 bucket)
            req.body.images.push(filename);

            //uploadFile to s3 bucket
            await uploadFile(file);
        })
    );
    next();
});


exports.getChats = factory.getAll(Chat);
exports.getChatRooms = catchAsync(async(req, res, next)=>{
     const doc = await ChatRoom.find().sort({ updatedAt: -1 });
    res.status(200).json({
        status: 'success',
        length: doc.length,
        doc
    });
});
/*
get all chat rooms of this current user
let user_id = user_id-1
ex:
{
roomName:"Room 1"
users:[user_id-1, user_id-2]
},
{
roomName:"Room 4"
users:[user_id-1, user_id-5]
}
*/
exports.getUserChatRooms = catchAsync(async (req, res, next) => {
    const doc = await ChatRoom.find(
        {
            users: {
                $in: [
                    req.params.id
                ]
            }
        }
    ).sort({ updatedAt: -1 });
    if (!doc) {
        return res.status(200).json({
            status: 'success',
            message: "No History of Chat Conversation"
        });
    }
    return res.status(200).json({
        status: 'success',
        length: doc.length,
        doc
    });
});

//get all messages in this chat room (will fetch all chats/message with this chatRoom_id)
exports.getChatRoomMessages = catchAsync(async (req, res, next) => {
    const doc = await Chat.find({ chatRoom: req.params.id });
    if (!doc) {
        return res.status(200).json({
            status: 'success',
            message: "No History of Messages"
        });
    }
    return res.status(200).json({
        status: 'success',
        length: doc.length,
        doc
    });
});
//find the chatroom of the currently log-in user and the selected user on search
exports.getUsersChatRoom = catchAsync(async (req, res, next) => {
    const doc = await ChatRoom.find(
        {
            $and: [
                {
                    users: {
                        $in: [
                            req.params.id,
                        ]
                    }
                },
                {
                    users: {
                        $in: [
                            res.locals.user._id
                        ]
                    }
                }
            ]
        }
    ).sort({ updatedAt: -1 });
    if (!doc) {
        return res.status(200).json({
            status: 'success',
            length: 0,
            message: "No History of Chat Conversation"
        });
    }
    return res.status(200).json({
        status: 'success',
        length: doc.length,
        doc
    });
});
//if (user) sender and receiver does not have a group chat then create one
//req.body should contain users, lastMessage, message and user_id of sender
exports.createUserChatRoom = catchAsync(async (req, res, next) => {
    //check first if they already have room or, upon selecting a 
    //person we must identify if they already have a room, otherwise we create one for them(front-end)
    const id = new mongoose.Types.ObjectId(); //auto generated id for lastMessage, will be the id of Chat
    //get all ids of physician and add to users
    const physicians = await User.find(
        {
            $or: [
                { role: 'dentist' },
                { role: 'doctor' },
                { role: 'nurse' }
            ]
        }
    );
    // get all physician_id
    let physicianIDs = [];
    physicians.forEach((physician) => {
        physicianIDs.push(physician._id.toString());
    })
    const chatRoom = await ChatRoom.create({
        users: [...req.body.users, ...physicianIDs],
        lastMessage: id
    });
    if (!chatRoom) {
        return res.status(400).json({
            message: 'Failed to create a chat room'
        })
    }
    //i think i can use res.locals.user_id to get id of currently log in user
    const message = await Chat.create({
        _id: id,
        chatRoom: chatRoom._id,
        message: req.body.message,
        files: req.body.files,
        seenBy: [res.locals.user._id],//seen by the sender
        sender: res.locals.user._id

    });
    if (!message) {
        //chatRoom if message did not persist
        await ChatRoom.findByIdAndDelete(chatRoom._id);
        return res.status(400).json({
            message: 'Failed to save message'
        })
    }
    let doc = message, chatroom = chatRoom;
    return res.status(200).json({
        status: 'success',
        doc,
        chatroom
    });
});

exports.sendMessage = catchAsync(async (req, res, next) => {
    //post on chatroom id
    const messageToSend = {
        chatRoom: req.params.id,
        message: req.body?.message,
        files: req.body.images || [],
        seenBy: [res.locals.user._id],
        sender: res.locals.user._id,
    }
    const message = await Chat.create(messageToSend);
    if (!message) {
        return res.status(400).json({
            message: 'Failed to Save Message'
        })
    }
    //update chatRoom
    const lastMessage = await ChatRoom.findByIdAndUpdate(req.params.id, { lastMessage: message._id });
    res.status(200).json({
        status: 'success',
        data: {
            message
        }
    });
});

//upon clicking on chatRoom user will automatically "seen" all the messages
exports.messageSeen = catchAsync(async (req, res, next) => {
    const doc = await Chat.updateMany({
        seenBy: {
            $nin: [
                res.locals.user._id
            ]
        }
    },
        {
            $push: { seenBy: res.locals.user._id }
        }
    );
    res.status(200).json({
        status: 'success',
        length: doc.length,
        doc
    })
});

exports.addPhysicianOnChatRooms = catchAsync(async (req, res, next) => {
    const doc = await ChatRoom.find();
    if (doc.length > 0) {
        doc.forEach(async (chatroom) => {
            let physicianExist = false;
            chatroom.users.forEach((user) => {
                if (user._id.toString() === req.params.id.toString()) {
                    physicianExist = true;
                    return true;
                }
            })
            if (!physicianExist) {
                chatroom.users.push(req.params.id);
                await chatroom.save();
            }
        })
    }

    return res.status(200).json({
        status: 'success',
        length: doc.length,
        doc
    });
});
