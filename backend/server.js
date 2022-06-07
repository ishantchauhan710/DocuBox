const express = require("express");
const dotenv = require("dotenv");
const connectToDatabase = require("./config/db");
const app = express();

const authRoutes = require("./routes/authRoutes.js");
const { notFoundMiddleware, errorHandlerMiddleware } = require("./middlewares/errorMiddleware");

// Enable environmental variable processing
dotenv.config();

// Enable JSON response processing
app.use(express.json());

// Connect to database [MongoDB]
connectToDatabase();

// Handle routes
app.use('/api/auth',authRoutes)

// Use middlewares for error handling
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Start the server
app.listen(process.env.PORT, () => {
  console.log("Server Started");
});
