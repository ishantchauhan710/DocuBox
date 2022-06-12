const aws = require("aws-sdk");
const path = require("path");
const { readFile } = require("fs");
const crypto = require("crypto");

const uploadFileToServer = async (fileName, file) => {
  if (!file) return console.log("Please provide a file path");

  const accessKey = process.env.STORAGE_ACCESS_KEY;
  const secretKey = process.env.STORAGE_SECRET_KEY;
  const storageBucket = process.env.STORAGE_BUCKET;
  const storageRegion = process.env.STORAGE_REGION;

  const storageUrl = `https://${storageRegion}.linodeobjects.com`;

  const client = new aws.S3({
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
    endpoint: new aws.Endpoint(storageUrl),
  });

  readFile(path.resolve(file), {}, async (error, data) => {
    if (error) {
      return console.log("Error reading file:" + error);
    }

    console.log("File Name:", fileName);

    try {
      await client
        .putObject({
          Bucket: storageBucket,
          Key: fileName,
          Body: data,
        })
        .promise();

      console.log(`File uploaded successfully: ${file}`);
    } catch (e) {
      console.error("Error uploading file: ", e);
    }
  });
};

const getUniqueFileName = (fileName) => {
  // Format: millis_randomUUID_img.jpg
  const date = new Date();
  const millis = date.getTime();

  const randomUUID = crypto.randomUUID();
  const formattedRandomUUID = randomUUID.replace(/-/g, "");

  const uniqueFileName = `${millis}_${formattedRandomUUID}_${fileName}`;
  return uniqueFileName;
};

const getOriginalFileName = (fileName) => {
  let uniqueName = fileName;
  uniqueName = uniqueName.split("_");
  uniqueName.shift();
  uniqueName.shift();
  const originalName = uniqueName.join("_");
  return originalName
};

module.exports = { uploadFileToServer, getUniqueFileName, getOriginalFileName };
