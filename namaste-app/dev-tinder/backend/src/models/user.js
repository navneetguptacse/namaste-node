const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      // minlength: [3, "First name must be at least 2 characters long"],
      // maxlength: [25, "First name cannot exceed 25 characters"],

      validate(name) {
        if (validator.isEmpty(name)) {
          throw new Error("First Name cannot be empty.");
        }
        if (!validator.isAlpha(name.replace(/\s/g, ""), "en-US")) {
          throw new Error(
            "First Name can only contain alphabetic characters and spaces."
          );
        }
        if (!validator.isLength(name, { min: 2, max: 20 })) {
          throw new Error(
            "First Name must be between 2 and 20 characters long."
          );
        }
      },

      // Or,
      // validate: {
      //   validator: function (value) {
      //     return new Promise((resolve, reject) => {
      //       setTimeout(() => {
      //         const nameRegex = /^[a-zA-Z\s]+$/;
      //         if (!nameRegex.test(value)) {
      //           reject(
      //             new Error("First name can only contain letters and spaces")
      //           );
      //         } else {
      //           resolve(true);
      //         }
      //       }, 100);
      //     });
      //   },
      //   message: "First name validation failed",
      // },
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
      // maxlength: [25, "Last name cannot exceed 25 characters"],

      validate(name) {
        if (validator.isEmpty(name)) {
          throw new Error("Last Name cannot be empty.");
        }
        if (!validator.isAlpha(name.replace(/\s/g, ""), "en-US")) {
          throw new Error(
            "Last Name can only contain alphabetic characters and spaces."
          );
        }
        if (!validator.isLength(name, { min: 2, max: 20 })) {
          throw new Error(
            "Last Name must be between 2 and 20 characters long."
          );
        }
      },

      // Or,
      // validate: {
      //   validator: function (value) {
      //     if (!value || value.trim() === "") {
      //       return Promise.resolve(true);
      //     }

      //     return new Promise((resolve, reject) => {
      //       setTimeout(() => {
      //         const nameRegex = /^[a-zA-Z\s]+$/;
      //         if (!nameRegex.test(value)) {
      //           reject(
      //             new Error("Last name can only contain letters and spaces")
      //           );
      //         } else {
      //           resolve(true);
      //         }
      //       }, 100);
      //     });
      //   },
      //   message: "Last name validation failed",
      // },
    },
    email: {
      type: String,
      required: true,
      unique: [
        true,
        "This email id already in use, please try again with another email id",
      ],
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address");
        }
      },
      // Or,
      // validate: {
      //   validator: function (value) {
      //     return new Promise((resolve, reject) => {
      //       setTimeout(() => {
      //         const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      //         if (!regex.test(value)) {
      //           reject(new Error("Please provide a valid email address"));
      //         } else {
      //           resolve(true);
      //         }
      //       }, 200);
      //     });
      //   },
      //   message: "Email validation failed",
      // },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Please, use a strong password.");
        }
      },
    },
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
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invlaid image URL");
        }
      },
      // Or,
      // validate: {
      //   validator: function (value) {
      //     return (
      //       validator.isURL(value, {
      //         protocols: ["http", "https"],
      //         require_protocol: true,
      //       }) &&
      //       (/\.(jpg|jpeg|png|gif|webp)$/i.test(value) ||
      //         /googleusercontent|cloudinary/i.test(value))
      //     );
      //   },
      //   message: "Photo URL must be a valid image link",
      // },
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

        const skList = value.map((s) => s.trim().toLowerCase());
        const unique = new Set(skList);

        if (skList.length !== unique.size) {
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
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
