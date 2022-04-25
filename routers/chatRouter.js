const express = require('express');
const chatController = require('../controllers/chatController');
const authController = require('../controllers/authController');
const router = express.Router();

router.use(authController.protect);//for authenticated users only
//the order is neccessary
router.route('/chat-rooms')
    .get(chatController.getChatRooms)
    .post(chatController.createUserChatRoom)
router.route('/chat-rooms/add-physician/:id')//id of physician(user_id) to add on all chatrooms
    .post(chatController.addPhysicianOnChatRooms)
router.route('/chat-rooms/:id')//id of user
    .get(chatController.getUserChatRooms)

//find the chatroom of the currently log-in user and the selected user on search
router.route('/chat-rooms/:id/search')//id of user, 
    .get(chatController.getUsersChatRoom)

router.route('/')
    .get(chatController.getChats)
router.route('/:id') //id of chatroom
    .get(chatController.getChatRoomMessages)
    .post(
        chatController.sendMessage
    ).patch(
        chatController.messageSeen
    );
router.route('/:id/files') //id of chatroom
    .post(
        chatController.uploadConvoImages,
        chatController.resizeConvoImages,
        chatController.sendMessage
    );

module.exports = router;

// TODO:Include notification system