const express = require("express");
const router = express.Router();
const session = require("express-session");
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Woi Login Dulu");
  res.redirect("/auth/login");
}

router.get(
  "/dashboard",
  checkAuthenticated,

  async (req, res) => {
    res.render("pages/dashboard", {
      title: "Dashboard",
    });
  }
);

module.exports = router;
