const express = require("express");
const dotenv = require("dotenv");
const connectToDatabase = require("./config/db");
const app = express();

dotenv.config();

connectToDatabase();

app.listen(5000, () => {
  console.log("Server Started");
});
