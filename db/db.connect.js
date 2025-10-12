const mongoose = require("mongoose");
require("dotenv").config();

const mongoURL = process.env.MONGO_URL;

const initializeDatabase = async () => {
  try {
    const connection = await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (connection) {
      console.log("Connected to database.");
    }
  } catch (error) {
    console.log("DB Connection failed.", error.message);
  }
};
module.exports = { initializeDatabase };
