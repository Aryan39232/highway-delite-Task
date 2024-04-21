var cookieParser = require("cookie-parser");
var createError = require("http-errors");
var express = require("express");
var cors = require("cors");

const connectDB = require("./DB/db");
require("dotenv").config();

const router = require("./Router/router");

connectDB();
var app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Remove the middleware reference
app.use("/api", router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  const messageArray = err.message.split("::");
  if (messageArray.length > 1) {
    res.status(messageArray[0]).json({
      status: false,
      response_code: messageArray[1],
      message: messageArray[2],
    });
  } else {
    res
      .status(500)
      .json({ status: false, response_code: 500, message: messageArray[0] });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
