const express = require("express");
const layouts = require("express-ejs-layouts");
const multer = require("multer");
const app = express();
const path = require("path");

require("dotenv").config();
const port = process.env.PORT || 3000;

// pengelolaan data untuk user
const {
  writeData,
  readData,
  readDataSync,
  updateData,
  deleteData,
} = require("./getData/getUsers");
//penglolaan data untuk comentar
const {
  readDataComent,
  addDataComent,
  deleteDataComent,
  editDataComent,
} = require("./getData/getComentar");
//pengelolaan data untuk logo
const getDataLogo = require("./getData/getLogo");

const { Images, deleteImage } = require("./getData/getImage");

// Middleware untuk parsing data form
app.use(layouts);

// sesion
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

// Middleware untuk parsing data form dan JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// menggunakan template engine EJS
app.set("view engine", "ejs");

// Atur direktori untuk file statis (CSS, JS, gambar, dll.)
app.use(express.static("public"));

app.use(cookieParser());
app.use(
  session({
    secret: "secret_key",
    resave: false,

    saveUninitialized: true,
    cookie: { secure: false, sameSite: "lax" },
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
const isAuthenticated = (req, res, next) => {
  if (req.session.name) {
    next();
  } else {
    req.flash("error", "Login dulu...");
    res.redirect("/");
  }
};

// multer  configurate untuk route input_image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public/input_image")); // Use absolute path here
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.split(".")[0] + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/gif"
    ) {
      cb(null, true);
    } else {
      req.fileValidationError =
        "File harus berupa gambar (jpeg, png, atau gif)";
      cb(null, false);
    }
  },
}).single("file");

// halaan utaman dashboard nya
app.get("/", (req, res) => {
  const messageError = res.locals.error;
  const messageSuccess = res.locals.success;
  res.render("dashboard", {
    layout: false,
    messageError,
    messageSuccess,
  });
});
app.post("/", (req, res) => {
  const { loginName, loginPassword, signupName, signupPassword, email, age } =
    req.body;
  if (loginName && loginPassword) {
    readData((users) => {
      const user = users.find((u) => u.name === loginName);
      if (user) {
        const passwordMatches = bcrypt.compareSync(
          loginPassword,
          user.password
        );
        if (passwordMatches) {
          //kirimkan data user ke session yaitu name dan age
          req.session.name = user.name;
          req.session.age = user.age;
          req.flash("success", "Login Success ..");
          return res.redirect("/home");
        } else {
          req.flash("error", "Password salah");
          return res.redirect("/");
        }
      } else {
        req.flash("error", "Pengguna tidak ditemukan");
        return res.redirect("/");
      }
    });
  }
  // Logika untuk signup
  else if (signupName && signupPassword && email && age) {
    writeData({
      name: signupName,
      password: signupPassword,
      email,
      age: parseInt(age, 10),
    });
    req.flash("success", "singgin success silahkan login kembali");
    res.redirect("/");
  } else {
    req.flash("error", "formulir di isi dulu...");
    return res.redirect("/");
  }
});

app.get("/home", isAuthenticated, (req, res) => {
  const messageSuccess = res.locals.success;
  res.render("MainPage/home", {
    title: "Halaman Home",
    messageSuccess,
    logo: getDataLogo(),
    fileCss: "css/home.css",
    fileJs: "js/home.js",
    login: "/login",
    layout: "layouts/main-layout",
  });
});
//lama logout

app.get("/comentar", isAuthenticated, (req, res) => {
  // baca data comentar
  const data = readDataComent().map((data) => {
    return data;
  });
  res.render("MainPage/comentar", {
    title: "Halaman comentar ",
    data,
    layout: "layouts/main-layout",
    fileCss: "css/comentar.css",
    fileJs: "js/comentar.js",
  });
});
app.post("/comentar", (req, res) => {
  const { inputKomentar } = req.body;
  if (inputKomentar) {
    //Ambil Username dan umur dari login
    const user = req.session.name;
    const age = req.session.age;
    // Lakukan operasi penyimpanan data
    addDataComent(user, age, inputKomentar);
    // Kirim respon sukses dalam format JSON
    return res.status(200).json({
      message: "Komentar berhasil ditambahkan silahkan refress halaman",
    });
  } else {
    return res.status(400).json({ error: "Input tidak valid." });
  }
});
//edit comentar
app.put("/comentar/edit", (req, res) => {
  const { date, newtext } = req.body;
  editDataComent(date, newtext);
  res.status(200).json({ message: "Komentar berhasil diedit!" });
});

// delete comentar
app.post("/comentar/:date", isAuthenticated, (req, res) => {
  const date = req.params.date;
  deleteDataComent(date);
  res.status(200).json({ message: "Komentar berhasil dihapus!" });
});

app.get("/input_image", isAuthenticated, (req, res) => {
  const error = req.query.error;
  const success = req.query.success;

  Images((err, images) => {
    if (err) {
      throw err;
    }
    res.render("MainPage/input_image", {
      images,
      title: "Halaman Input File",
      layout: "layouts/main-layout",
      message: error || success || null, // Menampilkan pesan error atau sukses
      fileCss: "/css/input_image.css",
      fileJs: "/js/input_image.js",
      message: error || success || null, // Menampilkan pesan error atau sukses
    });
  });
});
app.post("/input_image", (req, res) => {
  // Multer akan mengupload file ke folder input_image sesuai storage yang dibuat di atas.
  upload(req, res, (err) => {
    if (err) {
      // Redirect ke halaman yang sama dengan pesan error
      res.redirect("/input_image?error=" + encodeURIComponent("Error: " + err));
    } else {
      if (req.file === undefined) {
        // Redirect jika tidak ada file yang dipilih
        res.redirect(
          "/input_image?error=" + encodeURIComponent("no field selected")
        );
      } else if (req.fileValidationError || !req.file) {
        res.redirect(
          "/input_image?error=" + encodeURIComponent(req.fileValidationError)
        );
        res.status(404);
      } else {
        res.redirect(
          "/input_image?success=" + encodeURIComponent("upload success")
        );
      }
    }
  });
});

app.get("/logout", (req, res) => {
  // Cek apakah session benar-benar ada
  if (!req.session) {
    return res.redirect("/"); // Redirect ke halaman awal jika session tidak ada
  }
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/");
    }

    res.clearCookie("connect.sid");

    //req.session.flash("success", "logout");
    res.redirect("/");
  });
});

app.use("/", (reg, res) => {
  res.status(404).send("<h2 >Halaman tidak di temukan</h2>");
});
app.listen(port, () => {
  console.log("server berjalan di http://127.0.0.1:" + port);
});
