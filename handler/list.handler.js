const userinfo = require("../models/user");
const list = async (req, res) => {
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
};
module.exports = list;
