const cloudinary = require("../configs/cloudinary");

const uploadToCloudinary = (filePath, folder = "Movies Poster") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
  });
};

module.exports = uploadToCloudinary;
