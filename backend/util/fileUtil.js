const crypto = require("crypto");
const aws = require("aws-sdk");

const deleteFileFromStorage = async (storageFileName) => {
  aws.config.update({
    accessKeyId: process.env.STORAGE_ACCESS_KEY,
    secretAccessKey: process.env.STORAGE_SECRET_KEY,
    region: process.env.STORAGE_REGION,
  });
  const s3 = new aws.S3();

  const params = {
    Bucket: process.env.STORAGE_BUCKET,
    Key: storageFileName,
  };

  try {
    await s3.headObject(params).promise();
    try {
      await s3.deleteObject(params).promise();
      return true;
    } catch (err) {
      return false;
    }
  } catch (err) {
    return false;
  }
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
  return originalName;
};

const renameFile = (oldName, newName) => {
  // Get file extension
  let oldNameTemp = oldName;
  let fileExtAry = oldNameTemp.split(".");
  let fileExt = fileExtAry[fileExtAry.length - 1];

  // Finally rename the file
  let tempName = oldName;
  tempName = tempName.split("_");
  tempName.pop();
  const updatedName = tempName.join("_") + `_${newName}.${fileExt}`;
  return updatedName;
};

const convertFromBytesToMb = (size) => {
  return `${(size/(1024*1024)).toFixed(2)} Mb`
}

module.exports = {
  deleteFileFromStorage,
  getUniqueFileName,
  getOriginalFileName,
  renameFile,
  convertFromBytesToMb
};
