const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const auth = require("./routes/auth");
const campgrounds = require("./routes/campgrounds");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

const app = express();

app.use(express.json());

//Sanitize Data
app.use(mongoSanitize());

app.use(xss());

app.use(helmet());

//Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});

app.use(limiter);

app.use(hpp());

app.use(cors());

app.unsubscribe(cookieParser());

app.use("/api/v1/auth", auth);
app.use("/api/v1/campgrounds", campgrounds);

app.get("/", (req, res) => {
  res.status(200).json({ success: true, data: { id: 1 } });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(
  PORT,
  console.log(
    "Server running in ",
    process.env.NODE_ENV,
    " mode on port ",
    PORT
  )
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // close server & exit process
  server.close(() => process.exit(1));
});
