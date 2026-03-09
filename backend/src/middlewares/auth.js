const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const adminAuth = (req, res, next) => {
  try {
    const userId = req.userId;
  } catch (error) {}
};

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        message: "Authentication required. Please login.",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token. Please login again.",
        success: false,
      });
    }

    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "User not found. Please login again.",
        success: false,
      });
    }
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Authentication failed. Please login again.",
      success: false,
    });
  }
};

module.exports = { adminAuth, userAuth };
