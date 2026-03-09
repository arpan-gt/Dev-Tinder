const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to DB");
  } catch (error) {
    console.log("Database connecton failed", error);
    process.exit(1);
  }
};

module.exports = { connectDB };
