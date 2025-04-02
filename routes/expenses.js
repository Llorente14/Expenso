const express = require("express");
const router = express.Router();

const data = [
  {
    _id: 123,
    desc: "Beli Buah",
    category: "Belanja",
    date: "01-01-2024",
    price: 40000,
  },
];
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/auth/login");
}
router.get("/expenses", checkAuthenticated, async (req, res) => {
  res.render("pages/expenses", { title: "Expenses", data: data });
});

router.get("/expenses/add", async (req, res) => {
  res.render("pages/expensesAdd", { title: "Expenses" });
});

router.post("/expenses/add", checkAuthenticated, async (req, res) => {
  const spendData = {
    desc: req.body.desc,
    category: req.body.category,
    date: req.body.date,
    price: req.body.price,
  };
  data.push(spendData);
  res.redirect("/expenses");
});

router.get("/expenses/update/:id", checkAuthenticated, async (req, res) => {
  const id = req.params.id;
  res.render("pages/expensesUpdate", { title: `Expenses Update ${id} ` });
});
module.exports = router;
