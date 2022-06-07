// To create SSH tunnel between backend and server
const tunnel = require("tunnel-ssh"); 
const mongoose = require("mongoose");


const connectToDatabase = () => {
  const config = {
    username: process.env.HOST_USERNAME,
    password: process.env.HOST_PASSWORD,
    host: process.env.HOST_IP,
    port: process.env.HOST_PORT,
    dstHost: process.env.DESTINATION_HOST,
    dstPort: process.env.DESTINATION_PORT,
    localHost: process.env.LOCAL_HOST,
    localPort: process.env.LOCAL_PORT,
  };

  tunnel(config, (error, server) => {
    if (error) {
      console.log("SSH connection error: " + error);
      return;
    }

    const url = process.env.MONGO_URL;
    mongoose.connect(url, { useNewUrlParser: true });
    var db = mongoose.connection;
    db.on("error", console.error.bind(console, "DB connection error:"));
    db.once("open", function () {
      console.log("MongoDB connection established");
    });
  });
};

module.exports = connectToDatabase;
