const express = require("express");
const create = require("../handler/create.handler");
const withdrawal = require("./handler/withdrawal.handler");
const list = require("./handler/list.handler");
const get = require("./handler/get.handler");
const view = require("./handler/view.handler");

const { userRouter, viewRouter, withdrawRouter, getRouter, listRouter } =
  express.Router();

userRouter.route("/user").post(create).get(view);
withdrawRouter.route("/withdraw").post(withdrawal);
getRouter.route("/get").get(get);
listRouter.route("/list").get(list);

module.exports = {
  userRouter,
  viewRouter,
  withdrawRouter,
  getRouter,
  listRouter,
};
