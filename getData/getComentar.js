const fs = require("fs");
const path = require("path");

// path k file Json = comentar
const filePath = path.join(__dirname, "../data", "comentar.json");

if (!fs.existsSync(path.dirname(filePath))) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function readDataComent() {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}
function addDataComent(user, age, textComentar) {
  // data  = adlah array yg berisi comentar yg sudah ada
  const data = readDataComent();
  // Jika data kosong, set id ke 1, kalau tidak id terakhir + 1
  // tambahkn data ke array terakhir
  data.push({
    user,
    age,
    textComentar,
    timestamp: new Date(), // Menambahkan waktu komentar
  }); // Menambahkan data baru

  // Simpan data ke file json
  fs.writeFileSync(filePath, JSON.stringify(data));
}
function deleteDataComent(date) {
  // baca data nya dan cek kesamamn dgn TagName
  const data = readDataComent();
  let indexToDelete = -1;
  data.forEach((data, index) => {
    // Jika user cocok, indexToDelete diisi index data tersebut
    if (data.timestamp === date) {
      indexToDelete = index;
    }
  });
  // Jika ditemukan, hapus data tersebut
  if (indexToDelete !== -1) {
    data.splice(indexToDelete, 1);
    // Simpan data yang sudah dihapus ke file json
    fs.writeFileSync(filePath, JSON.stringify(data));
  }
}

function editDataComent(date, newtext) {
  // Baca data dari file
  const data = readDataComent();
  let found = false;

  // Perbarui data yang sesuai
  data.forEach((item) => {
    if (item.timestamp === date) {
      item.textComentar = newtext;
      found = true;
    }
  });

  if (found) {
    // Tulis ulang data yang diperbarui ke file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2)); // 'null, 2' untuk format JSON yang lebih rapi
    console.log("Data updated successfully");
  } else {
    console.log("Data not found");
  }
}
// -------------------------------------------------------------

// contoh penggunaan
// const data = readData();
// data.forEach((data) => {
//   console.log(data.TagName); // berhasil
// });

// const angkaUser = 5;
// const tagName = "Alice";
// const textComentar = "Ini adalah komentar baru.";

// Memanggil fungsi addDataComent dengan nilai-nilai baru

module.exports = {
  readDataComent,
  addDataComent,
  deleteDataComent,
  editDataComent,
};
