const express = require("express");
const routerNotification = express.Router();
const {
  deletedUserNotifcation,
  createNotifcationForSpecifiqueUser,
  getAllNotifcationByUser,
} = require("../controller/notification.controller.js");

routerNotification.delete("/delete/:id", deletedUserNotifcation);
routerNotification.post("/add", createNotifcationForSpecifiqueUser);
routerNotification.get("/get/:UserId", getAllNotifcationByUser);

module.exports = routerNotification;
