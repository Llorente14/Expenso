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

    let matchFilter = {};
    const now = new Date();

    // Tentukan filter berdasarkan periode
    if (period === "daily") {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0)); // Awal hari
      const endOfDay = new Date(now.setHours(23, 59, 59, 999)); // Akhir hari
      matchFilter.date = { $gte: startOfDay, $lt: endOfDay }; // Hari ini
    } else if (period === "weekly") {
      const startOfWeek = new Date(now.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1))); // Senin
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Minggu
      matchFilter.date = { $gte: startOfWeek, $lt: new Date(endOfWeek.setHours(23, 59, 59, 999)) };
    } else if (period === "monthly") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Tanggal 1 bulan ini
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Tanggal terakhir bulan ini
      matchFilter.date = { $gte: startOfMonth, $lt: new Date(endOfMonth.setHours(23, 59, 59, 999)) };
    } else if (period === "yearly") {
      const startOfYear = new Date(now.getFullYear(), 0, 1); // Awal tahun
      const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999); // Akhir tahun
      matchFilter.date = { $gte: startOfYear, $lt: endOfYear };
    }

    console.log("Match Filter:", matchFilter);

    // Gunakan agregasi untuk menjumlahkan data berdasarkan tanggal
    const expenses = await Expense.aggregate([
      { $match: matchFilter }, // Filter data berdasarkan periode
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" }, // Grup berdasarkan tanggal (YYYY-MM-DD)
          },
          totalPrice: { $sum: "$price" }, // Jumlahkan harga
        },
      },
      { $sort: { _id: 1 } }, // Urutkan berdasarkan tanggal
    ]);

    console.log("Aggregated Expenses:", expenses);

    // Format data untuk frontend
    const formattedExpenses = expenses.map((expense) => ({
      date: expense._id,
      price: expense.totalPrice,
    }));

    // Kirim data ke frontend
    res.json(formattedExpenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

module.exports = router;
