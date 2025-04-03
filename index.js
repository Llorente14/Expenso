if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const app = express();
const passport = require("passport");
const flash = require("express-flash");
const connectDB = require("./app/config/db");
const InitializePassport = require("./app/config/passport-config");
const PORT = 3000 || process.env.PORT;

//Koneksi Ke DB
connectDB();

//Pengecekan
async function hashing() {
  let hashedPass1 = await bcrypt.hash("123", 10);
  const users1 = [
    { id: 123, name: "123", gmail: "2@2", password: hashedPass1 },
  ];
  console.log(users1);
  return users1;
}
hashing().then((users) => {
  InitializePassport(
    passport,
    (gmail) => users.find((user) => user.gmail === gmail),
    (id) => users.find((user) => user.id === id)
  );
});

app.use(bodyParser.urlencoded());
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

app.use(express.static("public"));

//Enabling session

// Routes
const index = require("./routes/index");
const auth = require("./routes/auth");
const dashboard = require("./routes/dashboard");
const expenses = require("./routes/expenses");

app.use("/", index);
app.use("/auth", auth);
app.use("/", dashboard);
app.use("/", expenses);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
