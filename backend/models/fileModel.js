const mongoose = require("mongoose");

// Filer database object's structural representation
const fileSchema = mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    fileStorageUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: String,
      required: true,
    },
    fileOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    fileSharedTo: {
      type: [String],
      require: true,
    },
    fileDirectory: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Folder",
      require: false,
    },
  },
  {
    timeStamps: true,
  }
);

const File = mongoose.model("File", fileSchema);
module.exports = File;
