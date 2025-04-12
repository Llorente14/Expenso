const express = require("express");
const router = express.Router();
const Expense = require("../app/model/Expense");
// const data = [
//   {
//     _id: 123,
//     desc: "Beli Buah",
//     category: "Belanja",
//     date: "01-01-2024",
//     price: 40000,
//   },
// ];
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/auth/login");
}
router.get("/expenses", checkAuthenticated, async (req, res) => {
  const data = await Expense.find({}).sort({ date: -1 });

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

  await Expense.create(spendData)
  res.redirect("/expenses");
});

router.get("/expenses/update/:id", checkAuthenticated, async (req, res) => {
  const id = req.params.id;
  const data = await Expense.findById(id);
  if (!data) {
    req.flash("error", "Data tidak ditemukan");
    return res.redirect("/expenses");
  }
  res.render("pages/expensesUpdate", { title: `Expenses Update ${id} ` ,expenses:data});
});

router.post("/expenses/update/:id", checkAuthenticated, async (req, res) => {
  const id = req.params.id;
  const spendData = {
    desc: req.body.desc,
    category: req.body.category,
    date: req.body.date,
    price: req.body.price,
  };

  await Expense.findByIdAndUpdate(id, spendData);
  res.redirect("/expenses");
});


router.get("/expenses/delete/:id", checkAuthenticated, async (req, res) => {
  const id = req.params.id;
  await Expense.findByIdAndDelete(id);
  res.redirect("/expenses");
});


module.exports = router;
