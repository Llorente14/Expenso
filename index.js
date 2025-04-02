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

const InitializePassport = require("./app/config/passport-config");
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

//Agar mudah dalam redirect di ejs
app.locals.baseURL = "http://localhost:3000";
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

app.listen(3000);
console.log("Server is running on port 3000");
console.log("http://localhost:3000");
