const express = require("express");
const app = express();
const dashboardRouter = require("./routes/dashboard"); // Import router

// Middleware pendukung lainnya
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

// Setup view engine
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: "rahasia", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Pakai router
app.use("/", dashboardRouter); // <- Ini penting, biar /dashboard bisa diakses

// Server listen
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
