const express = require('express');
const requestController = require('../controllers/requestController');
const UserAuth = require('../middlewares/auth');

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserid", UserAuth, requestController.sendRequest);
requestRouter.post("/request/review/:status/:requestId", UserAuth, requestController.reviewRequest);

module.exports = requestRouter;