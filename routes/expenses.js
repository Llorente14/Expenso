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

router.get("/expenses", async (req, res) => {
  //   res.send("dash");
  res.render("pages/expenses", { title: "Expenses", data: data });
});

router.get("/expenses/add", async (req, res) => {
  //   res.send("dash");
  res.render("pages/expensesAdd", { title: "Expenses" });
});

router.get("/expenses/update/:id", async (req, res) => {
  //   res.send("dash");
  const id = req.params.id;
  res.render("pages/expensesUpdate", { title: `Expenses Update ${id} ` });
});
module.exports = router;
