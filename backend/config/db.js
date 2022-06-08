// To create SSH tunnel between backend and server
const tunnel = require("tunnel-ssh"); 
const mongoose = require("mongoose");


const connectToDatabase = () => {
    const url = process.env.MONGO_URL;
    mongoose.connect(url, { useNewUrlParser: true });
    var db = mongoose.connection;
    db.on("error", console.error.bind(console, "DB connection error:"));
    db.once("open", function () {
      console.log("MongoDB connection established");
    });
};

module.exports = connectToDatabase;
