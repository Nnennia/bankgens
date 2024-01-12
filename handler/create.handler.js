const {
  format,
  getMonth,
  getYear,
  differenceInYears,
  differenceInMonths,
} = require("date-fns");
const userinfo = require("../models/user");
const create = async (req, res) => {
  try {
    const { owner, amount, date } = req.body;
    if (!owner || !amount || !date) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const currentDate = new Date();
    const formattedDate = format(currentDate, "dd MMMM yyyy");
    const user = await userinfo.create({ owner, amount, date: formattedDate });
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};
module.exports = create;
