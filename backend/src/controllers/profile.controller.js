const User = require("../models/user.model");
const { validateEditProfileData } = require("../utils/validation");

//view other user profile
const viewUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User profile fetched",
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
//  * * view profile
const viewMyProfile = async (req, res) => {
  try {
    return res.status(200).json({
      message: "User profile fetched successfully",
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// * * edit my psrofile
const editMyProfile = async (req, res) => {
  try {
    const allowedUpdates = [
      "firstName",
      "lastName",
      "gender",
      "age",
      "description",
      "photoUrl",
      "skills",
    ];

    const updates = Object.keys(req.body);

    const isValidOperation = updates.every((field) =>
      allowedUpdates.includes(field),
    );

    if (!isValidOperation) {
      return res.status(400).json({
        message: "Invalid update field",
        success: false,
      });
    }

    validateEditProfileData(req.body);

    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      returnDocument: "after",
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// * * edit password

const editMyPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(401).json({
      message: "Old and new password required",
      success: false,
    });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({
        message: "User not valid",
        success: false,
      });
    }

    const isMatch = await user.isVerifiedPassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(201).json({
      message: "Password updated  successfully",
      success: true,
      _id: user._id,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
module.exports = {
  viewMyProfile,
  editMyProfile,
  editMyPassword,
  viewUserProfile,
};
