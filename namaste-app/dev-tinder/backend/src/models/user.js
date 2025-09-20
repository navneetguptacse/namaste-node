const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const secretKey = "My@Secret$Key#123";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters long"],
      maxlength: [25, "First name cannot exceed 25 characters"],
      validate(value) {
        if (!validator.isAlpha(value.replace(/\s/g, ""), "en-US")) {
          throw new Error(
            "First name can only contain alphabetic characters and spaces."
          );
        }
      },
    },
    lastName: {
      type: String,
      trim: true,
      minlength: [2, "Last name must be at least 2 characters long"],
      maxlength: [25, "Last name cannot exceed 25 characters"],
      validate(value) {
        if (value && !validator.isAlpha(value.replace(/\s/g, ""), "en-US")) {
          throw new Error(
            "Last name can only contain alphabetic characters and spaces."
          );
        }
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address");
        }
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    age: {
      type: Number,
      min: [18, "Must be at least 18 years old"],
      max: [120, "Age cannot exceed 120 years"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
      message: "Invalid gender value",
    },
    photo: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid image URL");
        }
      },
    },
    about: {
      type: String,
      default: function () {
        return `Hi, this is ${this.firstName || "User"}`;
      },
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 10) {
          throw new Error("You can add a maximum of 10 skills.");
        }

        const skillList = value.map((s) => s.trim().toLowerCase());
        const unique = new Set(skillList);

        if (skillList.length !== unique.size) {
          throw new Error("Skills must be unique.");
        }

        const isValid = value.every(
          (s) =>
            typeof s === "string" &&
            s.trim().length >= 2 &&
            s.trim().length <= 30
        );

        if (!isValid) {
          throw new Error(
            "Each skill must be a string between 2 and 30 characters."
          );
        }

        return true;
      },
    },
  },
  { timestamps: true }
);

UserSchema.methods.getJwtToken = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, secretKey, {
    expiresIn: "1d",
  });

  return token;
}

UserSchema.methods.verifyPwd = async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
}

const User = mongoose.model("User", UserSchema);
module.exports = User;