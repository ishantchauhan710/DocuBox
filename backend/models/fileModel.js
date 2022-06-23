const mongoose = require("mongoose");
var encrypt = require("mongoose-encryption");

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

fileSchema.plugin(encrypt, {
  encryptionKey: process.env.ENCRYPTION_KEY,
  signingKey: process.env.SIGNATURE_KEY,
  encryptedFields: ["fileStorageUrl", "fileOwner", "fileDirectory"],
});

const File = mongoose.model("File", fileSchema);
module.exports = File;
