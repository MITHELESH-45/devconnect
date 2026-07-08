const express = require('express');
const chatController = require('../controllers/chatController');
const UserAuth = require('../middlewares/auth');

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", UserAuth, chatController.getChat);

module.exports = chatRouter;