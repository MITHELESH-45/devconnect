const express = require('express');
const profileController = require('../controllers/profileController');
const UserAuth = require('../middlewares/auth');

const profileRouter = express.Router();

profileRouter.get("/profile/view", UserAuth, profileController.viewProfile);
profileRouter.patch("/profile/edit", UserAuth, profileController.editProfile);

module.exports = profileRouter;