const express = require("express");
const router = express.Router();

// Define your routes here

const {
  userSignUp,
  userSignIn,
  otpVerification,
} = require("../controller/user");

router.post("/userSignUp", userSignUp);
router.post("/userSignIn", userSignIn);
router.post("/otpVerification", otpVerification);

module.exports = router;
