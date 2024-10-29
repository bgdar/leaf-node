const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

// Data yang akan ditulis ke dalam file JSON
// const newUser = {
//   name: "ajaa",
//   email: "daasasa@example.com",
//   age: 20,
// };

// Path ke file JSON
const filePath = path.join(__dirname, "../data", "user.json");

// Pastikan folder 'data' ada, jika tidak, buat foldernya
if (!fs.existsSync(path.dirname(filePath))) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

// Membaca data dari file JSON secara syncronouse
function readDataSync() {
  const data = fs.readFileSync(filePath, "utf8");
  const user = JSON.parse(data);
  if (Array.isArray(user)) {
    return user;
  } else {
    return [];
  }
}

// Membaca data dari file JSON secara asinkron
function readData(callback) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error membaca file:", err);
      return callback([]); // Mengembalikan array kosong jika terjadi kesalahan
    }

    let userData = [];
    try {
      userData = JSON.parse(data);
    } catch (parseErr) {
      console.error("Error parsing JSON:", parseErr);
      return callback([]); // Mengembalikan array kosong jika parsing gagal
    }

    callback(userData); // Mengembalikan data melalui callback
  });
}
function writeData(user) {
  // Membaca data dari file JSON terlebih dahulu
  fs.readFile(filePath, "utf8", (err, data) => {
    let userData = [];
    if (err) {
      if (err.code === "ENOENT") {
        // Jika file tidak ditemukan, inisialisasi dengan array kosong
        console.log("File tidak ditemukan, membuat file baru.");
      } else {
        console.error("Error membaca file:", err);
        return;
      }
    } else {
      try {
        // Parsing data JSON
        userData = JSON.parse(data);
      } catch (parseErr) {
        console.error("Error parsing JSON:", parseErr);
        return;
      }
    }
    // Hash password sebelum menyimpannya
    const passwordHash = bcrypt.hashSync(user.password, 10);
    // Menambahkan data baru ke array
    userData.push({
      ...user,
      password: passwordHash, // Ganti password dengan hash
    });

    // Menulis data yang sudah diperbarui ke dalam file JSON
    fs.writeFile(filePath, JSON.stringify(userData, null, 2), (err) => {
      if (err) {
        console.error("Error menulis ke file:", err);
        return;
      }
      console.log("Data berhasil ditulis ke file:", filePath);
    });
  });
}

// Mengupdate data di file JSON
function updateData(name, updatedUser) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error membaca file:", err);
      return;
    }

    let userData = [];
    try {
      userData = JSON.parse(data);
    } catch (parseErr) {
      console.error("Error parsing JSON:", parseErr);
      return;
    }

    // Mencari index user berdasarkan name
    const index = userData.findIndex((user) => user.name === name);
    if (index === -1) {
      console.log("Pengguna dengan name tersebut tidak ditemukan.");
      return;
    }

    // Jika ada password baru dalam updatedUser, hash password tersebut
    if (updatedUser.password) {
      updatedUser.password = bcrypt.hashSync(updatedUser.password, 10);
    }

    // Memperbarui data pengguna
    userData[index] = { ...userData[index], ...updatedUser };

    fs.writeFile(filePath, JSON.stringify(userData, null, 2), (err) => {
      if (err) {
        console.error("Error menulis ke file:", err);
        return;
      }
      console.log("Data berhasil diperbarui:", filePath);
    });
  });
}

// Menghapus data dari file JSON
function deleteData(name) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error membaca file:", err);
      return;
    }

    let userData = [];
    try {
      userData = JSON.parse(data);
    } catch (parseErr) {
      console.error("Error parsing JSON:", parseErr);
      return;
    }

    // Mencari index user berdasarkan name
    const index = userData.findIndex((user) => user.name === name);
    if (index === -1) {
      console.log("Pengguna dengan name tersebut tidak ditemukan.");
      return;
    }

    // Menghapus data pengguna
    userData.splice(index, 1);

    // Perbaiki penamaan dari `writeFiles` ke `writeFile`
    fs.writeFile(filePath, JSON.stringify(userData, null, 2), (err) => {
      if (err) {
        console.error("Error menulis ke file:", err);
        return;
      }
      console.log("Data berhasil dihapus:", filePath);
    });
  });
}

//Penggunaan
// writeData({
//   name: "ahmad",
//   password: "ahmad",
//   email: "muhammadahmad@gmail.com",
//   age: 20,
// });

// updateData("Jda", { name: "ahmad", email: "ahmad@gmail.com", age: "300" }); ->(name_target,data_baru)
//deleteData("ahmad");
module.exports = { writeData, readData, readDataSync, updateData, deleteData };
