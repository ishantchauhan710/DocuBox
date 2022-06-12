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

module.exports = { getUniqueFileName, getOriginalFileName };
