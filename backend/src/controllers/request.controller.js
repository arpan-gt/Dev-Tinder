const { default: mongoose } = require("mongoose");
const { ConnectionRequest } = require("../models/connectionRequest.model");
const User = require("../models/user.model");

const sendRequest = async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const { toUserId, status } = req.params;

    const allowedStatus = ["interested", "ignore"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status type",
      });
    }

    if (fromUserId.toString() === toUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot send request to yourself",
      });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({
        success: false,
        message: "Target user not found",
      });
    }

    // check if connection exists
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: fromUserId, toUserId: toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      return res.status(400).json({
        message: "Connection request already exists",
        success: false,
      });
    }
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();
    res.status(200).json({
      message: `Connection request ${status} sent  successfully`,
      data,
      
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const reviewRequest = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { requestId, status } = req.params;

    const allowedStatus = ["accepted", "rejected"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: `Status "${status}" not allowed`,
        success: false,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        message: "Invalid request ID",
        success: false,
      });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if (!connectionRequest) {
      return res.status(400).json({
        message: "Connection request not found or already reviewed",
        success: false,
      });
    }

    // update status
    connectionRequest.status = status;

    const data = await connectionRequest.save();

    res.status(200).json({
      message: `Connection request ${status}`,
      data,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

module.exports = { sendRequest, reviewRequest };
