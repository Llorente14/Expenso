const express = require("express");

const router = express.Router();

router.get("/login", async (req, res) => {
  const name = req.query.name || "Guest";

  res.render("pages/login", { title: "Sign In", error: "" });
});

router.post("/login", async (req, res) => {
  let username = req.body.username;
  let gmail = req.body.gmail;
  let password = req.body.password;

  if ((username == "123" || gmail == "ax@gmail.com") && password == "123") {
    return res.redirect("/dashboard");
  }
  res.render("pages/login", { title: "Login", error: "Woi pass salah" });
});

router.get("/register", async (req, res) => {
  res.render("pages/register", { title: "Sign Up" });
});

router.post("/register", async (req, res) => {
  return res.redirect("/auth/login");
});

// router.post("/login", async (req, res) => {});

module.exports = router;
