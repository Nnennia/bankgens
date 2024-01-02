const express = require("express");
const bodyParser = require("body-parser");
const { db } = require("./config/database");
const app = express();
const userinfo = require("./models/user");
const {
  format,
  getMonth,
  getYear,
  differenceInYears,
  differenceInMonths,
} = require("date-fns");
require("dotenv").config();

const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

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

app.post("/create", async (req, res) => {
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
});

app.get("/view", async (req, res) => {
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
});
app.post("/withdrawal", async (req, res) => {
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
});

app.get("/get", async (req, res) => {
  try {
    const users = await userinfo.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});
app.get("/list", async (req, res) => {
  try {
    const { owner } = req.body;
    const page = req.query.page || 1;
    const limit = 10;

    const users = await userinfo
      .findOne({ owner })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});
const server = () => {
  try {
    db();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};

server();
