const { db } = require("../models/index");
const { Sequelize, Op } = require("sequelize");

module.exports = {
  getAllNotifcationByUser: async function (req, res) {
    try {
      const allNotification = await db.Notifcation.findAll({
        where: { UserId: req.params.UserId },
      });

      res.status(200).send(allNotification);
    } catch (error) {
      res.json(error);
    }
  },

  createNotifcationForSpecifiqueUser: async function (req, res) {
    try {
      const newNotifcation = await db.Notifcation.create({
        UserId: req.body.UserId,
        notification: req.body.notification,
        type: req.body.type,
      });

      res.status(200).send(newNotifcation);
    } catch (error) {
      res.json(error);
    }
  },

  deletedUserNotifcation: async function (req, res) {
    try {
      const deletedNotification = await db.Notifcation.destroy({
        where: {
          id: req.params.id,
        },
      });

      res.json(deletedNotification);
    } catch (error) {
      throw error;
    }
  },
};
