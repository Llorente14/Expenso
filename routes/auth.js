const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const router = express.Router();
const {  checkNotAuthenticated } = require("../app/config/auth");


//Database Collection
const Category = require("../app/model/Category");
const User = require("../app/model/Users");



router.get("/login", checkNotAuthenticated, async (req, res) => {
  res.render("pages/login", { title: "Sign In" , alertmsg: req.flash("alertmsg"), error: req.flash("error")});
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
  res.render("pages/register", { title: "Sign Up" , alertmsg: req.flash("alertmsg"), error: req.flash("error")});
});

router.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const { name, gmail, password, cpassword } = req.body;

    if (password !== cpassword) {
      req.flash("alertmsg", "Password confirmation doesn't match");
      return res.redirect("/auth/register");
    }

    const existingUser = await User.findOne({ 
      $or: [
        { gmail: gmail },
        { name: name }
      ]
    });
    
    if (existingUser) {
      console.log("User already exists:", existingUser);
      if (existingUser.gmail === gmail) {
       
       req.flash("alertmsg", "Email already exists");
      } else {
        alert("Username already exists");
        req.flash("alertmsg", "Username already exists");
      }
      return res.redirect("/auth/register");
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, gmail, password: hashedPass , role: "user"});

    const defaultCategories = [
       "Belanja", "Transfer", "Transportasi", "Kebutuhan Pokok"
    ];

    const categories = defaultCategories.map(name => ({
      name,
      user: newUser._id
    }));

    await Category.insertMany(categories);

    req.flash("success", "Registration successful. Please login");
    res.redirect("/auth/login");
  } catch (error) {
    console.error("Registration error:", error);
    req.flash("alertmsg", "Registration failed");
    res.redirect("/auth/register");
  }
});

//logout handler
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    // Gunakan req.flash() SEBELUM redirect
    req.flash("alertmsg", "Anda berhasil Log Out");

    res.redirect("/auth/login");
  });
});


module.exports = router;
