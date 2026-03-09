const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, email, password } = req.body;
  if (!firstName || !email || !password) {
    throw new Error("All fields are required");
  } else if (firstName.length < 3 || firstName.length > 30) {
    throw new Error("fistName can only have characters between 3 to 30");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email format");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter strong password");
  }
};

const validateLoginData = (req) => {
  const { email, password } = req.body;
  if (!email || !validator.isEmail(email) || !password) {
    throw new Error("Please enter email or password  correctly");
  }
};

const validateEditProfileData = (data) => {
  const { firstName, lastName, age, gender, photoUrl, skills, description } =
    data;

  if (firstName !== undefined) {
    if (typeof firstName !== "string") {
      throw new Error("First name must be a string");
    }

    const trimmed = firstName.trim();

    if (trimmed.length < 3 || trimmed.length > 30) {
      throw new Error("First name must be between 3 and 30 characters");
    }
  }

  if (gender && !["Male", "Female"].includes(gender)) {
    throw new Error("Invalid gender value");
  }

  if (photoUrl && !validator.isURL(photoUrl)) {
    throw new Error("Invalid photo URL");
  }

  if (skills) {
    const uniqueSkills = new Set(skills);
    if (uniqueSkills.size !== skills.length) {
      throw new Error("Duplicate skills not allowed");
    }
  }

  if (description && description.length > 300) {
    throw new Error("Description too long");
  }
};
module.exports = {
  validateSignupData,
  validateLoginData,
  validateEditProfileData,
};
