const mongoose = require("mongoose");
const UserSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    otp: {
      type: Number,
      default: null,
    },
    isOtpVerifiedSignUp: {
      type: Number,
      default: 0,
    },
    tokens: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      default: "",
    },
    status: {
      type: Number,
      default: 0,
    },
    expirationTime: {
      type: String,
      default: "",
    },
  },
  { collection: "users", timestamps: true }
);

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
