const { db } = require("../models/index");
const { Sequelize, Op } = require("sequelize");

module.exports.add = async function (req, res) {
  try {
    const added = await db.BookMark.create(req.body);
    res.json(added);
  } catch (err) {
    throw err;
  }
};

module.exports.check = async function (req, res) {
  try {
    const task = await db.BookMark.findOne({
      where: {
        UserId: req.params.UserId,
        CarId: req.params.carId,
      },
    });
    res.json(task);
  } catch (er) {
    throw er;
  }
};
module.exports.getAll = async function (req, res) {
  try {
    const allCars = [];
    const all = await db.BookMark.findAll({
      where: { UserId: req.params.UserId },
    });
    for (const bookmark of all) {
      const car = await db.Car.findOne({ where: { id: bookmark.CarId } });
      const agency = await db.Agency.findOne({ where: { id: car.AgencyId } });
      const carImage = await db.Media.findOne({
        where: { CarId: bookmark.CarId },
      });

      const carInfo = {
        car: car,
        agency: agency,
        carImage: carImage,
      };

      allCars.push(carInfo);
    }
    res.send(allCars);
  } catch (err) {
    throw err;
  }
};
module.exports.remove = async function (req, res) {
  try {
    const del = await db.BookMark.destroy({
      where: {
        CarId: req.params.CarId,
      },
    });
    res.json(del);
  } catch (err) {
    throw err;
  }
};
