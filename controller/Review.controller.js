const { Sequelize, Op } = require("sequelize");
const { db } = require("../models/index");
const Review = db.Review;
module.exports = {
  BringAllReview: async (req, res, next) => {
    try {
      const task = await Review.findAll();
      res.status(200).send(task);
    } catch (err) {
      next(err);
    }
  },
  MakeReview: async (req, res, next) => {
    try {
      const task = await Review.create({
        ...req.body,
        AgencyId: req.params.receiverId,
      });
      res.json(task);
    } catch (err) {
      throw err;
    }
  },
  getAllByAgencyId: async (req, res) => {
    try {
      const { AgencyId } = req.params;
      const response = await Review.findAll({
        where: { senderType: "client", AgencyId: AgencyId },
        include: [db.Car],
        order: [["rating", "DESC"]],
      });
      res.status(200).send(response);
    } catch (err) {
      throw err;
    }
  },
  getAllRatingByCar: async (req, res) => {
    try {
      const response = await Review.findAll({
        where: { CarId: req.params.CarId },

        order: [["rating", "DESC"]],
      });
      res.status(200).send(response);
    } catch (err) {
      throw err;
    }
  },
};
