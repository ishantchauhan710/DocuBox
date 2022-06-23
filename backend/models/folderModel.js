const mongoose = require("mongoose");
var encrypt = require("mongoose-encryption");

// Folder database object's structural representation
const folderSchema = mongoose.Schema(
  {
    folderName: {
      type: String,
      required: true,
    },
    folderOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    folderSharedTo: {
      type: [String],
      require: true,
    },
    folderParentDirectory: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Folder",
      require: false,
    },
  },
  {
    timeStamps: true,
  }
);

folderSchema.plugin(encrypt, {
  encryptionKey: process.env.ENCRYPTION_KEY,
  signingKey: process.env.SIGNATURE_KEY
});

const Folder = mongoose.model("Folder", folderSchema);
module.exports = Folder;
