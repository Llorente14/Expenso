if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const path = require("path");
const app = express();
const passport = require("passport");
const flash = require("express-flash");
const connectDB = require("./app/config/db");
const InitializePassport = require("./app/config/passport-config");

//Database Model
const Users = require("./app/model/Users");
const PORT =  process.env.PORT || 3000;

//Koneksi Ke DB
connectDB();

//Pengecekan
InitializePassport(passport);

app.use(express.urlencoded({ extended: true }));
//Auth Login Register
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, //No value ga usah di save di session
  })
);
app.use(passport.initialize());
app.use(passport.session());

//Global var untuk msg (error)
app.use((req, res, next) => {
  if (req.flash("alertmsg").length > 0) {
    res.locals.alertmsg = req.flash("alertmsg");
  } else {
    res.locals.alertmsg = null; // Pastikan null jika tidak ada
  }
  // Jangan lupa juga menangani flash message dari Passport
  res.locals.error = req.flash("error"); // Untuk error authentication
  res.locals.message = req.flash("message"); // Untuk success messages

  next();
});

//Agar mudah dalam redirect di ejs
app.locals.baseURL = `http://localhost:${PORT}`;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/script', express.static(path.join(__dirname, 'public/script')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
//Menangani error favicon
app.get('/favicon.ico', (req, res) => res.status(204).end());
//Enabling session

// Routes
const index = require("./routes/index");
const auth = require("./routes/auth");
const dashboard = require("./routes/dashboard");
const expenses = require("./routes/expenses");
<<<<<<< HEAD
const admin = require("./routes/admin");
=======
const setting = require("./routes/setting");
const categoryRoutes = require('./routes/category');
>>>>>>> 1c54ec3a9b4e4d677dec5482297433c49963bac3

app.use("/", index);
app.use("/auth", auth);
app.use("/", dashboard);
app.use("/", expenses);
<<<<<<< HEAD
app.use("/admin", admin);
=======
app.use("/", setting);
app.use('/', categoryRoutes);
>>>>>>> 1c54ec3a9b4e4d677dec5482297433c49963bac3

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
module.exports = app;
//trash
// async function hashing() {
//   let hashedPass1 = await bcrypt.hash("123", 10);
//   const users1 = [
//     { id: 123, name: "123", gmail: "2@2", password: hashedPass1 },
//   ];
//   console.log(users1);
//   return users1;
// }
// hashing().then((users) => {
//   InitializePassport(
//     passport,
//     (gmail) => users.find((user) => user.gmail === gmail),
//     (id) => users.find((user) => user.id === id)
//   );
// });
