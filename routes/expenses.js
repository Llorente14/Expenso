const express = require("express");
const router = express.Router();
const Expense = require("../app/model/Expense");
const Category = require('../app/model/Category');



const { checkAuthenticated } = require("../app/config/auth");
// const data = [
//   {
//     _id: 123,
//     desc: "Beli Buah",
//     category: "Belanja",
//     date: "01-01-2024",
//     price: 40000,
//   },
// ];

router.get("/expenses", checkAuthenticated, async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const category = req.query.category || null;
    let filter = { user: req.user._id };
    if (searchQuery) {
      filter.desc = { $regex: searchQuery, $options: "i" };
    }
    if (category) {
      filter.category = category;
    }

    // Pagination
    const perPage = 5;
    const page = parseInt(req.query.page) || 1;

    const count = await Expense.countDocuments(filter);
    const startIndex = count === 0 ? 0 : (page - 1) * perPage + 1;
    const endIndex = Math.min(startIndex + perPage - 1, count);
    const nextPage = page + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    const data = await Expense.find(filter)
      .sort({ date: -1 }) // Sort dari tanggal terbaru
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.render("pages/expenses", {
      title: "Expenses",
      data,
      user: req.user,
      searchQuery,
      currentCategory: category,
      counter: {
        startIndex,
        endIndex,
        count,
      },
      current: page,
      nextPage: hasNextPage ? nextPage : null,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    req.flash("error", "Gagal memuat data");
    res.render("pages/expenses", { title: "Expenses", data: [] });
  }
});
router.get("/expenses/add", async (req, res) => {
  res.render("pages/expensesAdd", { title: "Expenses" , user: req.user });
  
});

router.post("/expenses/add", checkAuthenticated, async (req, res) => {
  let dateValue;
  try {
    const dateParts = req.body.date.split("/");
    const categories = await Category.find({ user: req.user._id });
  
    // Ini buat format jadi DD/MM/YYYY dari form ke mongoDB
    dateValue = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
     // Tambahkan waktu sekarang ke tanggal yang diinputkan
     const now = new Date();
     dateValue.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
    // Check if the date is valid
    if (isNaN(dateValue.getTime())) {
      throw new Error("Invalid date");
    }
  } catch (error) {
    req.flash("error", "Format tanggal tidak valid. Gunakan format DD/MM/YYYY");
    return res.redirect("/expenses");
  }

  const spendData = {
    desc: req.body.desc,
    category: req.body.category,
    date: dateValue,
    price: req.body.price,
    user: req.user._id,
  };

  try {
    await Expense.create(spendData);
    res.redirect("/expenses");
  } catch (error) {
    req.flash("error", "Gagal menambahkan data pengeluaran");
    res.redirect("/expenses");
  }
});

router.get("/expenses/update/:id", checkAuthenticated, async (req, res) => {
  const id = req.params.id;
  const data = await Expense.findOne({ _id: id, user: req.user._id });

  if (!data) {
    req.flash("error", "Data tidak ditemukan");
    return res.redirect("/expenses");
  }

  // Format date ke dd/mm/yyyy
  const dateObj = new Date(data.date);
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  res.render("pages/expensesUpdate", {
    title: `Expenses Update ${id}`,
    user: req.user,
    categories,
    expenses: {
      ...data.toObject(),
      formattedDate,
    },
  });
});

router.post("/expenses/update/:id", checkAuthenticated, async (req, res) => {
  const id = req.params.id;

  // Parse the date string to create a valid Date object
  let dateValue;
  try {
    // Split the date string by "/"
    const dateParts = req.body.date.split("/");
    // Create a new Date object with format: YYYY-MM-DD
    // Note: Month is 0-indexed in JavaScript Date, so we subtract 1
    dateValue = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);

    // Check if the date is valid
    if (isNaN(dateValue.getTime())) {
      throw new Error("Invalid date");
    }
  } catch (error) {
    req.flash("error", "Format tanggal tidak valid. Gunakan format DD/MM/YYYY");
    return res.redirect("/expenses");
  }

  const spendData = {
    desc: req.body.desc,
    category: req.body.category,
    date: dateValue,
    price: req.body.price,
  };

  const updatedExpense = await Expense.findOneAndUpdate(
    { _id: id, user: req.user._id },
    spendData,
    { new: true }
  );

  if (!updatedExpense) {
    req.flash("error", "Data tidak ditemukan atau Anda tidak memiliki akses");
    return res.redirect("/expenses");
  }
  res.redirect("/expenses");
});

router.get("/expenses/delete/:id", checkAuthenticated, async (req, res) => {
  const id = req.params.id;
  const deletedExpense = await Expense.findOneAndDelete({
    _id: id,
    user: req.user._id,
  });

  if (!deletedExpense) {
    req.flash("error", "Data tidak ditemukan atau Anda tidak memiliki akses");
    return res.redirect("/expenses");
  }
  res.redirect("/expenses");
});

module.exports = router;
