const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  gmail: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: Number, 
    enum: [0, 1], 
    default: 0, 
  },
});

module.exports = mongoose.model("Users", UserSchema);
