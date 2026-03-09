const { connections } = require("mongoose");
const { ConnectionRequest } = require("../models/connectionRequest.model");
const User = require("../models/user.model");

const getAllRequests = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName photoUrl skills");

    if (connectionRequests.length === 0) {
      return res.status(200).json({
        message: "No requests found",
        success: true,
      });
    }

    res.status(200).json({
      message: "Requests fetched",
      success: true,
      connectionRequests,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};

const getAllConnections = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      status: "accepted",
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "firstName lastName photoUrl skills age gender")
      .populate("toUserId", "firstName lastName photoUrl skills age gender");

    if (connections.length === 0) {
      return res.status(200).json({
        message: "No connections found",
        success: true,
      });
    }

    const data = connections.map((conn) => {
      if (conn.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return conn.toUserId;
      }
      return conn.fromUserId;
    });

    res.status(200).json({
      message: "Connections fetched successfully",
      success: true,
      data,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};

const getFeed = async (req, res) => {
  try {
    const loggedInUser = req.user;

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    let skip = (page - 1) * limit;

    const existingConnection = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    existingConnection.forEach((conn) => {
      hideUsersFromFeed.add(conn.fromUserId.toString());
      hideUsersFromFeed.add(conn.toUserId.toString());
    });

    const feedUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("-password -email -createdAt -updatedAt")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: feedUsers,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};

module.exports = { getAllRequests, getAllConnections, getFeed };
