const mongoose = require("mongoose");

const userinfoSchema = new mongoose.Schema({
  owner: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  balance: { type: Number },
});

const userinfo = mongoose.model("Userinfo", userinfoSchema);
module.exports = userinfo;
