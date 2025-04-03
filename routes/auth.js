const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const router = express.Router();

//Saat udah ada mongoDB apus aja
const users = [];

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
    //Matching cpass and pass
    // if (req.body.password !== req.body.cpassword) {
    //   res.redirect("/auth/register", {
    //     msg: "Confirm password doesn`t match with password",
    //   });
    //   return;
    // }

    let hashedPass = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      gmail: req.body.gmail,
      password: hashedPass,
    });
    res.redirect("/auth/login");
  } catch {
    res.redirect("/auth/register");
  }
  console.log(users);
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

module.exports = router;
