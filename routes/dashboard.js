const express = require("express");
const router = express.Router();
const Expense = require("../app/model/Expense");
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Woi Login Dulu");
  res.redirect("/auth/login");
}

router.get("/dashboard", checkAuthenticated, async (req, res) => {
  const data = await Expense.find({}).sort({ date: -1 }).limit(5);
  res.render("pages/dashboard", {
    title: "Dashboard",
    data,
  });
});

//Endpoint untuk digunakan di chart.js nantinya untuk dapat data pengeluaran
router.get("/api/expenses", async (req, res) => {
  try {
    const { period = "monthly" } = req.query; // Ambil parameter period dari query
 
    let filter = {};

    // Tentukan filter berdasarkan periode
    const now = new Date();
    if (period === "daily") {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0)); // Awal hari
      const endOfDay = new Date(now.setHours(23, 59, 59, 999)); // Akhir hari
      filter.date = { $gte: startOfDay, $lt: endOfDay }; // Hari ini
    } else if (period === "weekly") {
      // Tentukan awal minggu (Senin) dan akhir minggu (Minggu)
      const startOfWeek = new Date(now.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1))); // Senin
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Minggu
    
      // Filter untuk minggu ini
      filter.date = { $gte: startOfWeek, $lt: new Date(endOfWeek.setHours(23, 59, 59, 999)) };
    }else if (period === "monthly") {
      // Tentukan awal bulan dan akhir bulan
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Tanggal 1 bulan ini
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Tanggal terakhir bulan ini
    
      // Filter untuk bulan ini
      filter.date = { $gte: startOfMonth, $lt: new Date(endOfMonth.setHours(23, 59, 59, 999)) };
    } else if (period === "yearly") {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      filter.date = { $gte: startOfYear }; // Tahun ini
    }
    console.log("Filter:", filter);
    // Ambil data pengeluaran berdasarkan filter
    const expenses = await Expense.find(filter, {
      date: 1,
      price: 1,
      _id: 0,
    }).sort({ date: 1 });
    console.log("Expenses:", expenses);

    // Kirim data ke frontend
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

module.exports = router;
