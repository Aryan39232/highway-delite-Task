const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi"); // Import Joi library
const nodemailer = require("nodemailer");
const UserModel = require("../model/user");
require("dotenv").config("../.env");

const userSignUpValidation = Joi.object({
  fullName: Joi.string()
    .error(new Error("200::422::Name is require."))
    .required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .error(new Error("200::422::Emial is require."))
    .required(),
  password: Joi.string()
    .error(new Error("200::422::password is require."))
    .required(),
});

const loginValidation = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .error(new Error("200::422::Emial is require."))
    .required(),
  password: Joi.string()
    .error(new Error("200::422::password is require."))
    .required(),
});

const otpverificationValidation = Joi.object({
  fullName: Joi.string().error(new Error("200::422::Name is require.")),
  otp: Joi.number().error(new Error("200::422::OTP is require.")).required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .error(new Error("200::422::Email is require."))
    .required(),
});
const sendEmail = async (subject, to, message) => {
  // Set up email transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Set to true if your SMTP server requires a secure connection (SSL/TLS)
    auth: {
      user: process.env.EMAILID,
      pass: process.env.EMAILPASSWORD,
    },
  });

  try {
    // Send email using transporter
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: to,
      subject: subject,
      text: message,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

const userSignUp = async (req, res, next) => {
  const body = req.body;
  try {
    const validateData = userSignUpValidation.validate(body);

    if (validateData.error) {
      throw new Error(validateData.error.message);
    }
    const email = body.email;

    const getUserData = await UserModel.findOne({ email: email });
    console.log(getUserData);

    if (!getUserData) {
      const generatePassword = body.password;
      const hash_password = await bcrypt.hash(generatePassword, 10);

      // Send OTP on Email
      const otp = Math.floor(1000 + Math.random() * 9000);

      await sendEmail("OTP Verification", email, `Your OTP is: ${otp}`);

      const userObject = new UserModel({
        fullName: body.fullName.trim(),
        email: email,
        password: hash_password,
        otp: otp,
      });

      await userObject.save();

      console.log("hello");
      return res.status(200).json({
        status: true,
        response_code: 200,
        message: "user created successfully.",
      });
    } else {
      // if (getUserData[0].isOtpVerifiedSignUp === 1) {
      throw new Error("200::422::User with this Email is already exist!");
      // }
    }
  } catch (error) {
    console.log("Error", error.message);
    return next(error);
  }
};

const userSignIn = async (req, res, next) => {
  const body = req.body;
  try {
    const validateData = loginValidation.validate(body);
    if (validateData.error) {
      throw new Error(validateData.error.message);
    }

    const email = body.email;

    const userData = await UserModel.findOneAndUpdate(
      { email: email },
      { isOtpVerifiedSignUp: 1 },
      { new: true }
    );

    if (userData.length === 0)
      throw new Error("200::422:: Email and Password Invalid!");

    console.log("userData: ", userData);

    const isPassword = await bcrypt.compare(body.password, userData.password);

    if (isPassword) {
      let userToken = jwt.sign(
        { _id: userData._id },
        process.env.JWT_USER_TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRATION_TIME }
      );

      const userDataInfo = await UserModel.findOneAndUpdate(
        { email },
        {
          tokens: userToken,
          expirationTime: process.env.TOKEN_EXPIRATION_TIME,
        }
      );

      // change it for new schema
      res.status(200).json({
        status: true,
        response_code: 200,
        token: userToken,
        message: "User logged in successfully.",
        data: {
          name: userData.fullName,
          email: userData.email,
        },
      });
    } else {
      throw new Error("200::422:: Email and Password Invalid!");
    }
  } catch (err) {
    console.log("Error", err.message);
    return next(err);
  }
};

const otpVerification = async (req, res, next) => {
  const body = req.body;
  try {
    const validateData = otpverificationValidation.validate(body);

    if (validateData.error) {
      throw new Error(validateData.error.message);
    }

    const email = body.email;

    const getUserData = await UserModel.find({ email: email });

    if (!getUserData) throw new Error("500::400::Internal Error");

    if (getUserData[0].otp != body.otp) {
      throw new Error("200::422::Wrong OTP.");
    }

    const userToken = jwt.sign(
      { _id: getUserData[0]._id },
      process.env.JWT_USER_TOKEN_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRATION_TIME }
    );

    console.log(getUserData);
    await UserModel.findOneAndUpdate(
      { _id: getUserData[0]._id },
      { token: userToken, otp: null, isOtpVerifiedSignUp: 1 }
    );

    return res.status(200).json({
      status: true,
      response_code: 200,
      token: userToken,
      message: "Otp Verified successfully.",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  userSignUp,
  userSignIn,
  otpVerification,
};
