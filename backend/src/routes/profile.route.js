const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {
  viewMyProfile,
  editMyProfile,
  editMyPassword,
  viewUserProfile,
} = require("../controllers/profile.controller");
const profileRouter = express.Router();

profileRouter.get("/view", userAuth, viewMyProfile);
profileRouter.get("/:userId", userAuth, viewUserProfile);
profileRouter.patch("/edit", userAuth, editMyProfile);
profileRouter.patch("/password", userAuth, editMyPassword);

module.exports = { profileRouter };
