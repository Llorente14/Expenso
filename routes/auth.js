const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const router = express.Router();

//Database Collection
const User = require("../app/model/Users");

//Middleware agar user harus login untuk masuk ke dashboard ataupun sebaliknya

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/expenses");
  }
  next();
}

router.get("/login", checkNotAuthenticated, async (req, res) => {
  res.render("pages/login", { title: "Sign In" });
});

router.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })
);

router.get("/register", checkNotAuthenticated, async (req, res) => {
  res.render("pages/register", { title: "Sign Up" });
});

router.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const { name, gmail, password, cpassword } = req.body;

    if (password !== cpassword) {
      req.flash("error", "Password confirmation doesn't match");
      return res.redirect("/auth/register");
    }

    const existingUser = await User.findOne({ gmail });
    if (existingUser) {
      req.flash("error", "Email already registered");
      return res.redirect("/auth/register");
    }

    const hashedPass = await bcrypt.hash(password, 10);
    await User.create({ name, gmail, password: hashedPass });

    req.flash("success", "Registration successful. Please login");
    res.redirect("/auth/login");
  } catch (error) {
    console.error("Registration error:", error);
    req.flash("error", "Registration failed");
    res.redirect("/auth/register");
  }
});

//logout handler
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    // Gunakan req.flash() SEBELUM redirect
    req.flash("alertmsg", "Anda Berhasil Log Out");

    res.redirect("/auth/login");
  });
});

function insertOneUser() {}

module.exports = router;
