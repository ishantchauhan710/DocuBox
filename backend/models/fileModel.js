const mongoose = require("mongoose");

// Filer database object's structural representation
const fileSchema = mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    fileData: {
      type: String,
      required: true,
    },
    fileOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    fileDirectory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      require: true,
    },
  },
  {
    timeStamps: true,
  }
);

const File = mongoose.model("File", fileSchema);
module.exports = File;
