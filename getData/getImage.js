const fs = require("fs");
const path = require("path");

const dirPath = path.join(__dirname, "../public/tmp/input_image");
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}
function Images(callback) {
  fs.readdir(dirPath, (err, data) => {
    if (err) {
      console.log(err);
      return callback(err, null); // Callback with error
    }
    return callback(null, data); // Callback with data
  });
}

function deleteImage(nameImage) {
  fs.unlink(path.join(dirPath, nameImage), (err) => {
    if (err) {
      console.error("Error hapus file:", err);
      return;
    }
    console.log("File berhasil dihapus:", nameImage);
  });
}
module.exports = { deleteImage, Images };
