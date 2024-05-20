const { db } = require("../models/index");
const { Sequelize, Op } = require("sequelize");
const { all } = require("../router/carRouter");

module.exports = {
  getAllCars: async function (req, res) {
    try {
      const allCars = await db.Car.findAll({
        include: [
          { model: db.Media, as: "Media" },
          {
            model: db.Agency,
            as: "Agency",
            include: [{
              model: db.User,
              as: "User"
            }]
          },
        ],
        order: [['createdAt', 'DESC']] // Add this line to sort by createdAt in descending order
      });
  
      res.status(200).send(allCars);
    } catch (error) {
      res.json(error);
    }
  },
  


  CreateCar: async function (req, res,next) {
    try {
      const newCar = await db.Car.create(
        req.body
      );
      res.status(200).send(newCar);
    } catch (error) {
      next(error);
    }
  },
  createImage: async function (req, res,next) {
    try {
      const image = await db.Media.create(
        req.body
      );
      res.status(200).send(image);
    } catch (error) {
      next(error);
    }
  },
  filterCarByBrand: async function (req, res) {
    try {
      const carByBrand = await db.Car.findAll({
        where: { brand: req.body.brand },
        include: { model: db.Media, as: "Media" },
      });

      res.status(200).send(carByBrand);
    } catch (error) {
      res.json(error);
    }
  },

  searchCarByModel: async function (req, res) {
    const model = req.params.model;
    try {
      const carSearched = await db.Car.findAll({
        where: {
          model: {
            [Op.like]: `%${model}%`,
          },
        },
      });

      res.status(200).send(carSearched);
    } catch (error) {
      res.json(error);
    }
  },
  filtredCar: async function (req, res) {
    const filters = req.body;
    const { price, typevehicle, characteristics } = filters;

    const where = {
      price: {
        [Op.between]: price,
      },
      typevehicle: typevehicle,

      characteristics: characteristics,
    };
    try {
      const filtredOne = await db.Car.findAll({
        where,
        include: { model: db.Media, as: "Media" },
      });

      res.json(filtredOne);
    } catch (error) {
      res.json(error);
    }
  },
  searchCarById: async function (req, res) {
    try {
      const carById = await db.Car.findOne({
        where: { id: req.params.id * 1 },
      });
      console.log(carById);
      res.status(200).send(carById);
    } catch (error) {
      throw error;
    }
  },

  deletedAgencyCar: async function (req, res) {
    try {
      const deletedCar = await db.Car.destroy({
        where: {
          id: req.params.id,
          AgencyId: req.params.AgencyId,
        },
      });

      res.json(deletedCar);
    } catch (error) {
      throw error;
    }
  },

  getAllCarsByAgencyId: async function (req, res) {
    try {
      const allCars = [];
      const allCarsByAgency = await db.Car.findAll({
        where: { AgencyId: req.params.AgencyId },
      });
      for (const OneCar of allCarsByAgency) {
        const car = await db.Car.findOne({ where: { id: OneCar.id } });

        const carImage = await db.Media.findOne({
          where: { CarId: car.id },
        });
        const carInfo = {
          car: car,
          carImage: carImage,
        };

        allCars.push(carInfo);
      }
      res.status(200).send(allCars);
    } catch (error) {
      throw error;
    }
  },
  updateCar: async function (req, res) {
    try {
      if (!req.params.id) {
        res.send(404).send({"message":"id not found"})
      }
      const carId = req.params.id;
      const updatedCar = await db.Car.update(
        {
          price: req.body.price,
          priceWeekly: req.body.priceWeekly,
          priceMonthly: req.body.priceMonthly,
        },
        {
          where: { id: carId },
        }
      );

      res.status(200).send(updatedCar);
    } catch (error) {
      res.status(500).send({"message":error})
      console.log(JSON.stringify(error));
    }
  },

};
