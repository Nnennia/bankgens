const userinfo = require("../models/user");
const {
  format,
  getMonth,
  getYear,
  differenceInYears,
  differenceInMonths,
} = require("date-fns");
// Helper function to calculate gain for a given investment
const calculateGain = (investmentAmount, months) => {
  if (investmentAmount < 0 || months < 0) {
    throw new Error("Investment amount and months must be positive values");
  }
  const monthlyInterestRate = 0.52 * 100;
  return investmentAmount * Math.pow(1 + monthlyInterestRate, months);
};

//Helper function to calculate balance
const expectedBalance = (calculateGain, investmentAmount) => {
  return calculateGain + investmentAmount;
};

// Helper function to calculate tax for a given gain
const calculateTax = (gain, years) => {
  let taxRate;
  if (years < 1) {
    taxRate = 22.5 / 100;
  } else if (years >= 1 && years < 2) {
    taxRate = 18.5 / 100;
  } else {
    taxRate = 15 / 100;
  }
  return gain * taxRate;
};
const view = async (req, res) => {
  try {
    const { owner } = req.body;
    const user = await userinfo.findOne({ owner });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const currentDate = new Date();
    const investDate = new Date(user.date);
    const monthsSinceInvest = differenceInMonths(currentDate, investDate);
    const gain = calculateGain(user.amount, monthsSinceInvest);
    const view = expectedBalance(gain, user.amount);
    res.status(200).json({
      owner: owner,
      amount: user.amount,
      balance: view,
    });
  } catch (error) {
    console.error("Error retrieving users", error);
    res.status(500).json({ message: "Failed to process" });
  }
};
module.exports = view;
