const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const User = require("./models/User");
const Department = require("./models/Department");
const SystemSettings = require("./models/SystemSettings");
const Book = require("./models/Book");
const BookRequest = require("./models/BookRequest");
const IssuedBook = require("./models/IssuedBook");
const Return = require("./models/Return");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://smart-book-administration.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

// middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

const reportRoutes = require("./routes/reportRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reports", reportRoutes);

// test route
app.get("/health", (req, res) => {
  res.send("Backend & DB connected ");
});

// connect DB
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    family: 4,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
