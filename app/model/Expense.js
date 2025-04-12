const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const expenseSchema = new Schema({
  desc: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  //Biar saat masing2 user bisa CRUD
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

module.exports = mongoose.model("Expense", expenseSchema);
