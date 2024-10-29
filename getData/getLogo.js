const path = require("path");
const fs = require("fs");
// Path ke file JSON
const filePath = path.join(__dirname, "../data", "logo.json");

function getDataLogo() {
  const data = fs.readFileSync(filePath, "utf8");
  const getLogo = JSON.parse(data);
  if (Array.isArray(getLogo)) {
    return getLogo;
  } else {
    console.log("logo not found: " + JSON.stringify(getLogo));
  }
}
module.exports = getDataLogo;
