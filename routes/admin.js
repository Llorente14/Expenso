const express = require("express");

const router = express.Router();

const User = require("../app/model/Users");
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
  
    res.redirect("/auth/login");
  }
router.get("/",checkAuthenticated, async (req, res) => {
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

    const count = await User.countDocuments(filter);
    const startIndex = count === 0 ? 0 : (page - 1) * perPage + 1;
    const endIndex = Math.min(startIndex + perPage - 1, count);
    const nextPage = page + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    const data = await User.find(filter)
      .sort({ createAt: -1 }) // Sort dari tanggal terbaru
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

module.exports = router;