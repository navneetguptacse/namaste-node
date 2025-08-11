const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
    minlength: [3, "First name must be at least 2 characters long"],
    maxlength: [25, "First name cannot exceed 25 characters"],
    validate: {
      validator: function (value) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const nameRegex = /^[a-zA-Z\s]+$/;
            if (!nameRegex.test(value)) {
              reject(
                new Error("First name can only contain letters and spaces")
              );
            } else {
              resolve(true);
            }
          }, 100);
        });
      },
      message: "First name validation failed",
    },
  },
  lastName: {
    type: String,
    required: false,
    trim: true,
    maxlength: [25, "Last name cannot exceed 25 characters"],
    validate: {
      validator: function (value) {
        if (!value || value.trim() === "") {
          return Promise.resolve(true);
        }

        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const nameRegex = /^[a-zA-Z\s]+$/;
            if (!nameRegex.test(value)) {
              reject(
                new Error("Last name can only contain letters and spaces")
              );
            } else {
              resolve(true);
            }
          }, 100);
        });
      },
      message: "Last name validation failed",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (value) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regex.test(value)) {
              reject(new Error("Please provide a valid email address"));
            } else {
              resolve(true);
            }
          }, 200);
        });
      },
      message: "Email validation failed",
    },
  },
  password: { type: String, required: true },
  age: {
    type: Number,
    min: [18, "Must be at least 18 years old"],
    max: [120, "Age cannot exceed 120 years"],
    validate: {
      validator: function (age) {
        return Promise.resolve(age >= 18 && age <= 120);
      },
      message: "Age must be between 18 and 120",
    },
  },
  gender: {
    type: String,
    validate(value) {
      if (!["male", "female", "others"].includes(value)) {
        throw new Error(`'${value}' is not valid gender.`);
      }
    },
  },
  photo: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  },
  about: { type: String, default: "Hi👋" },
  skills: { type: [String] },
});

module.exports = mongoose.model("User", UserSchema);
