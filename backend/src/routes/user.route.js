const express = require("express");
const {
  getAllRequests,
  getAllConnections,
  getFeed,
} = require("../controllers/user.controller");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();

userRouter.get("/connections", userAuth, getAllConnections);
userRouter.get("/requests", userAuth, getAllRequests);
userRouter.get("/feed", userAuth, getFeed);

module.exports = { userRouter };
