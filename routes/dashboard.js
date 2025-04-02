const express = require("express");
const router = express.Router();

router.get("/dashboard", async (req, res) => {
  //   res.send("dash");
  res.render("pages/dashboard", { title: "Dashboard" });
});

module.exports = router;
