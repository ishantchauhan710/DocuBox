const aws = require("aws-sdk");
const path = require("path");
const { readFile } = require("fs");

const uploadFileToServer = async (file) => {
  if (!file) return console.log("Please provide a file path");

  const accessKey = process.env.STORAGE_ACCESS_KEY;
  const secretKey = process.env.STORAGE_SECRET_KEY;
  const storageBucket = process.env.STORAGE_BUCKET;
  const storageRegion = process.env.STORAGE_REGION;

  const fileName = path.basename(file);

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

module.exports = { uploadFileToServer };
