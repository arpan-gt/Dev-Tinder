const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 30,
    },
    lastName: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email format");
        }
      },
    },
    password: { type: String, required: true, trim: true, minLength: 6 },
    age: { type: Number, required: true, min: 18 },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female"],
        message: "Gender must be either Male or female",
      },
      required: true,
    },
    photoUrl: {
      type: String,
      trim: true,
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error("Invalid photo URL " + value);
        }
      },
    },
    description: { type: String, trim: true },
    skills: {
      type: [String],
      required: true,
      validate(value) {
        const uniqueSkills = new Set(value);
        if (uniqueSkills.size !== value.length) {
          throw new Error("Duplicate skills not allowed");
        }
      },
    },
  },
  { timestamps: true },
);

// pre save
// userSchema.pre("save", function (next) {
//   if (this.skills && this.skills.length > 0) {
//     this.skills = [...new Set(this.skills.map((skill) => skill.toLowercase()))];
//   }
// });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJWT = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.isVerifiedPassword = async function (password) {
  const isMatched = await bcrypt.compare(password, this.password);

  return isMatched;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
