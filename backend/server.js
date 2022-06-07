const express = require("express");
const dotenv = require("dotenv");
const connectToDatabase = require("./config/db");
const app = express();

const authRoutes = require("./routes/authRoutes.js")

// Enable environmental variable processing
dotenv.config();

// Enable JSON response processing
app.use(express.json());

// Connect to database [MongoDB]
connectToDatabase();


app.use('/api/auth',authRoutes)

// Start the server
app.listen(process.env.PORT, () => {
  console.log("Server Started");
});
