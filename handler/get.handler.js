const userinfo = require("../models/user");
const get = async (req, res) => {
  try {
    const users = await userinfo.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
};
module.exports = get;
