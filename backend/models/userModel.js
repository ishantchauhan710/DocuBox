const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// User database object's structural representation
const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      require: true,
    },
    userPassword: {
      type: String,
      require: true,
    },
  },
  {
    timeStamps: true,
  }
);

// Before saving the user, encrypt the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("userPassword")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.userPassword = await bcrypt.hash(this.userPassword, salt);
});

// To check if input password is correct or not
userSchema.methods.matchPassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
