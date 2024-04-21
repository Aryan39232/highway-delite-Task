const mongoose = require("mongoose");

require("dotenv").config("../.env");
const connectDB = async () => {
  try {
    const client = await mongoose.connect(process.env.DB_URI);
    console.log("Connected to mongo!!!");
  } catch (err) {
    console.log("Could not connect to MongoDB", err);
  }
};

module.exports = connectDB;
