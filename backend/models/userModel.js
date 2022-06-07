const bcrypt = require("bcryptjs/dist/bcrypt");
const mongoose = require("mongoose");

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
    userProfilePicture: {
      type: String,
      require: false,
    },
  },
  {
    timeStamps: true,
  }
);

userSchema.pre("save", async (next) => {
  if (!this.isModified("userPassword")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.userPassword = await bcrypt.hash(this.userPassword, salt);
});

userSchema.methods.matchPassword = async (inputPassword) => {
    return await bcrypt.compare(inputPassword,this.userPassword);
}

const User = mongoose.model('User',userSchema);
module.exports = User