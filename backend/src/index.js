require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { connectDB } = require("./utils/connectDB");
const app = express();
const cookieParser = require("cookie-parser");
const { authRouter } = require("./routes/auth.route");
const { profileRouter } = require("./routes/profile.route");
const { requestRouter } = require("./routes/request.route");
const { userRouter } = require("./routes/user.route");

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

// * * routes middlewares
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);

// * * start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log("server running on PORT " + PORT);
    });
  } catch (error) {
    console.log("Startup failed ", error);
  }
};

startServer();
