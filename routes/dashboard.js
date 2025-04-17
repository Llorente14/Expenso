const express = require("express");
const router = express.Router();
const Expense = require("../app/model/Expense");
const { checkAuthenticated } = require("../app/config/auth");
router.get("/dashboard", checkAuthenticated, async (req, res) => {
  try {
    let filter = { user: req.user._id };
    const data = await Expense.find(filter).sort({ date: -1 }).limit(5);
    const now = new Date();

    // Hitung total pengeluaran harian
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));
    const dailyTotal = await Expense.aggregate([
      { $match: { ...filter, date: { $gte: startOfDay, $lt: endOfDay } } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    // Hitung total pengeluaran mingguan
    const startOfWeek = new Date(now.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1)));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const weeklyTotal = await Expense.aggregate([
      { $match: { ...filter, date: { $gte: startOfWeek, $lt: new Date(endOfWeek.setHours(23, 59, 59, 999)) } } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    // Hitung total pengeluaran bulanan
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const monthlyTotal = await Expense.aggregate([
      { $match: { ...filter, date: { $gte: startOfMonth, $lt: new Date(endOfMonth.setHours(23, 59, 59, 999)) } } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    // Hitung total pengeluaran tahunan
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    const yearlyTotal = await Expense.aggregate([
      { $match: { ...filter, date: { $gte: startOfYear, $lt: endOfYear } } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    // Kirim data ke template EJS
    res.render("pages/dashboard", {
      title: "Dashboard",
      data,
      user: req.user,
      dailyTotal: dailyTotal[0]?.total || 0,
      weeklyTotal: weeklyTotal[0]?.total || 0,
      monthlyTotal: monthlyTotal[0]?.total || 0,
      yearlyTotal: yearlyTotal[0]?.total || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//Endpoint untuk digunakan di chart.js nantinya untuk dapat data pengeluaran
router.get("/api/expenses", checkAuthenticated, async (req, res) => {

  try {
    let filter = { user: req.user._id };
    const { period = "monthly" } = req.query; // Ambil parameter period dari query

    let matchFilter = {...filter};
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

// API buat pie chart
router.get("/expenses/data", checkAuthenticated, async (req, res) => {
  try {
    let filter = { user: req.user._id }; // Pastikan req.user tersedia
    const expenses = await Expense.aggregate([
      { $match: filter }, // Terapkan filter berdasarkan pengguna
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    res.json(expenses); // Kirim data dalam format JSON
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;