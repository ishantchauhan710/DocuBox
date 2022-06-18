const crypto = require("crypto");

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

module.exports = { getUniqueFileName, getOriginalFileName, renameFile };
