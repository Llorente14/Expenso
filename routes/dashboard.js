const express = require("express");
const router = express.Router();

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/auth/login");
}

router.get("/dashboard", checkAuthenticated, async (req, res) => {
  //   res.send("dash");
  res.render("pages/dashboard", { title: "Dashboard" });
});

module.exports = router;
