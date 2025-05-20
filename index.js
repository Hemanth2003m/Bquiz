require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require('body-parser');
const addExcel = require('./Routers/addExcel'); // Adjust path as needed
const fs = require("fs");
const path = require("path");

const connectDB = require("./Config/db");
const errorHandler = require("./Middilwares/errorHandlers");

const questionRoutes = require("./Routers/questionRoutes");
const adminRoutes = require("./Routers/adminRoutes"); // ✅ added admin routes

const app = express();
const PORT = process.env.PORT || 8080;

// Create logs directory if it doesn't exist
const logDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Create a write stream for logging
const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, "access.log"),
  { flags: "a" } // append mode
);

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(bodyParser.json());

// Routes
app.use("/api", questionRoutes);
app.use("/api/admin", adminRoutes);
app.use('/', addExcel);


// Email verification route (handled inside adminRoutes):
// GET /api/admin/verify?token=...

// Error handler
app.use(errorHandler);



// DB Connection
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
