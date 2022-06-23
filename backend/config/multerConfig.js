const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const dotenv = require("dotenv");
const { getUniqueFileName } = require("../util/fileUtil");

// Configuring storage variables
dotenv.config();
const storageRegion = process.env.STORAGE_REGION;
const storageUrl = `https://${storageRegion}.linodeobjects.com`;

// Setup AWS Client
aws.config.update({
  secretAccessKey: process.env.STORAGE_SECRET_KEY,
  accessKeyId: process.env.STORAGE_ACCESS_KEY,
  endpoint: new aws.Endpoint(storageUrl),
});

// Aws S3 Client Object
s3 = new aws.S3();

// Create a Multer Storage Object
const multerStorage = multer({
  storage: multerS3({
    s3: s3,
    acl: "public-read",
    bucket: process.env.STORAGE_BUCKET,
    key: function (req, file, cb) {
      console.log(file);
      cb(null, getUniqueFileName(file.originalname));
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024 }, 
    onFileUploadStart: function (file, req, res) {
      if(file.size>=50*1024*1024) {
        console.log("File upload canceled")
        return res.json({message: "Unable to upload file, no space left"});
      }
    },
});

module.exports = { multerStorage };
