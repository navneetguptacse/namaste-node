const validator = require("validator");

const signUpData = (req) => {
  const { firstName, lastName, email, password, age, gender, photo, about, skills } = req.body;

  // Required fields
  if (!firstName || firstName.trim().length === 0) {
    throw new Error("First name is required");
  }
  if (firstName.length < 2 || firstName.length > 25) {
    throw new Error("First name must be between 2 and 25 characters");
  }

  if (!email) {
    throw new Error("Email is required");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email format");
  }

  if (!password) {
    throw new Error("Password is required");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must include uppercase, lowercase, number, and special character"
    );
  }

  // Optional fields
  if (lastName && (lastName.length < 2 || lastName.length > 25)) {
    throw new Error("Last name must be between 2 and 25 characters");
  }

  if (age && (age < 18 || age > 120)) {
    throw new Error("Age must be between 18 and 120");
  }

  if (gender && !["male", "female", "others"].includes(gender)) {
    throw new Error("Invalid gender value");
  }

  if (photo && !validator.isURL(photo)) {
    throw new Error("Invalid image URL");
  }

  if (skills) {
    if (!Array.isArray(skills)) {
      throw new Error("Skills must be an array");
    }
    if (skills.length > 10) {
      throw new Error("You can add a maximum of 10 skills");
    }

    const skillList = skills.map((s) => s.trim().toLowerCase());
    const unique = new Set(skillList);

    if (unique.size !== skills.length) {
      throw new Error("Skills must be unique");
    }

    const isValid = skills.every(
      (s) =>
        typeof s === "string" &&
        s.trim().length >= 2 &&
        s.trim().length <= 30
    );
    if (!isValid) {
      throw new Error("Each skill must be a string between 2 and 30 characters");
    }
  }

  return { firstName, lastName, email, password, age, gender, photo, about, skills };
};

module.exports = {
  signUpData,
};
