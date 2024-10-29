const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 3000;

// Dummy data pengguna ssebagai contoh
// const users = [
//   {
//     id: 1,
//     username: "user1",
//     passwordHash: bcrypt.hashSync("password123", 10), // Simpan hash password
//   },
//   {
//     id: 7,
//     username: "user7",
//     passwordHash: bcrypt.hashSync("password127", 10), // Simpan hash password
//   },
// ];
const { writeData, readData, updateData, deleteData } = require("./users.js");

// Middleware untuk parsing data form
app.use(bodyParser.urlencoded({ extended: false }));

// Konfigurasi cookie-parser
app.use(cookieParser());

// Konfigurasi express-session
app.use(
  session({
    secret: "my-secret-key", // Gantilah dengan secret key yang kuat
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set ke true jika menggunakan HTTPS
  })
);

// Konfigurasi connect-flash
app.use(flash());

// Middleware untuk menambahkan pesan flash ke response locals
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  next();
});

// Middleware untuk mengecek jika pengguna sudah login
const isAuthenticated = (req, res, next) => {
  if (req.session.userAge) {
    next();
  } else {
    req.flash("error", "You must be logged in to view this page");
    res.redirect("/login");
  }
};

// Route untuk halaman login
app.get("/login", (req, res) => {
  const errorMessage = res.locals.error;
  res.send(`
        <h2>Login</h2>
        <form method="POST" action="/login">
            ${errorMessage} ? <p style="color:red;">${errorMessage}</p> : ""}
            <label for="username">Username:</label>
            <input type="text" name="username" required>
            <label for="password">Password:</label>
            <input type="password" name="password" required>
            <button type="submit">Login</button>
        </form>
    `);
});

// Route untuk menangani login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  readData((users) => {
    // Cek apakah pengguna ada di dalam data
    const user = users.find((u) => u.name === username);

    if (user) {
      // Bandingkan password yang dimasukkan dengan hash password yang disimpan
      const passwordMatches = bcrypt.compareSync(password, user.password);
      if (passwordMatches) {
        req.session.userAge = user.age; // Set session dengan user age
        return res.redirect("/dashboard");
      } else {
        // Jika password salah, set flash message dan redirect ke login
        req.flash("error", "Password salah");
        return res.redirect("/login");
      }
    } else {
      // Jika pengguna tidak ditemukan, set flash message dan redirect ke login
      req.flash("error", "Pengguna tidak ditemukan");
      return res.redirect("/login");
    }
  });
});

// Route untuk dashboard (hanya bisa diakses setelah login)
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.send(`
        <h2>Dashboard</h2>
        <p>Welcome, user ${req.session.userAge}!</p>
        <a href="/logout">Logout</a>
    `);
});

// Route untuk logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send("Error during logout");
    }
    res.redirect("/login");
  });
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
