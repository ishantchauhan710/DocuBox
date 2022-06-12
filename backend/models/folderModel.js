const mongoose = require("mongoose");

// Folder database object's structural representation
const folderSchema = mongoose.Schema(
  {
    folderName: {
      type: String,
      required: true,
    },
    folderOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      require: true,
    },
    folderParentDirectory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folders",
      require: false
    },
  },
  {
    timeStamps: true,
  }
);

const Folder = mongoose.model('Folder',folderSchema);
module.exports = Folder