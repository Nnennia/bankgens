const {
  format,
  getMonth,
  getYear,
  differenceInYears,
  differenceInMonths,
} = require("date-fns");
const userinfo = require("../models/user");
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
const withdrawal = async (req, res) => {
  try {
    const { owner, date } = req.body;
    const currentDate = new Date();
    const user = await userinfo.findOne({ owner, date });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const investDate = new Date(user.date);
    const yearsSinceInvest = differenceInYears(currentDate, investDate);

    // Calculate gain based on the number of months since the investment
    const monthsSinceInvest = differenceInMonths(currentDate, investDate);
    const gain = calculateGain(user.amount, monthsSinceInvest);

    // Calculate tax based on the age of the investment
    const tax = calculateTax(gain, yearsSinceInvest);

    // Calculate the withdrawal amount after deducting tax
    const withdrawalAmount = user.amount + gain - tax;
    if (user.balance === undefined) {
      user.balance = 0;
    }
    // Update user balance and save
    if (!isNaN(user.balance)) {
      user.balance -= tax;
      await user.save();
    }

    res
      .status(200)
      .json({ message: "Withdrawal successful", withdrawalAmount, tax });
  } catch (error) {
    console.error("Error handling withdrawal:", error);
    res.status(500).json({ error: "Failed to process withdrawal" });
  }
};

module.exports = withdrawal;
