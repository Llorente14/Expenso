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
const MongoStore = require('connect-mongo');
const connectDB = require("./app/config/db");
const InitializePassport = require("./app/config/passport-config");

//Database Model
const Users = require("./app/model/Users");
const PORT =  process.env.PORT || 3000;

//Koneksi Ke DB
connectDB();

//Pengecekan
InitializePassport(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Auth Login Register
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions' 
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 
    }
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

const admin = require("./routes/admin");

const setting = require("./routes/setting");
const categoryRoutes = require('./routes/category');


app.use("/", index);
app.use("/auth", auth);
app.use("/", dashboard);
app.use("/", expenses);


app.use("/", admin);

app.use("/", setting);
app.use('/', categoryRoutes);


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
