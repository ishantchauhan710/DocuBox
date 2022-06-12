const express = require("express");
const dotenv = require("dotenv");
const connectToDatabase = require("./config/db");
const app = express();

const authRoutes = require("./routes/authRoutes.js");
const documentRoutes = require("./routes/documentRoutes.js");

const {
  notFoundMiddleware,
  errorHandlerMiddleware,
} = require("./middlewares/errorMiddleware");

// Enable environmental variable processing
dotenv.config();

// Enable JSON response processing
app.use(express.json());

// Connect to database [MongoDB]
connectToDatabase();

// Handle routes
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);


// Use middlewares for error handling
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Start the server
app.listen(process.env.PORT, () => {
  console.log("Server Started");
});
