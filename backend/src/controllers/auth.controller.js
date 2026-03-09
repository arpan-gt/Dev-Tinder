const User = require("../models/user.model");

const {
  validateSignupData,
  validateLoginData,
} = require("../utils/validation");

// * * signup controller
const signUp = async (req, res) => {
  const { firstName, lastName, email, password, age, gender, skills } =
    req.body;
  try {
    validateSignupData(req);
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }

    const user = await new User({
      firstName,
      lastName,
      email,
      password,
      age,
      gender,
      skills,
    });

    await user.save();

    return res.status(201).json({
      message: "User signup successfully",
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// * * login controller
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    validateLoginData(req);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }

    const isPasswordCorrect = await user.isVerifiedPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Email or password wrong",
        success: false,
      });
    }

    const token = await user.getJWT();

    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      message: "User logged In",
      success: true,
      user: userData,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({
      message: "Logged out",
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
module.exports = { signUp, login, logout };
