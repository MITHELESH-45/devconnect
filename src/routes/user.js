const express = require('express');
const userController = require('../controllers/userController');
const UserAuth = require('../middlewares/auth');

const userRouter = express.Router();

userRouter.get("/user/requests/received", UserAuth, userController.getReceivedRequests);
userRouter.get("/user/connections", UserAuth, userController.getConnections);
userRouter.get("/user/feed", UserAuth, userController.getFeed);

module.exports = userRouter;