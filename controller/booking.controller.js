const { db } = require("../models/index");
const { Op } = require("sequelize");
function getDatesInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

module.exports = {
  getRentalHistory: async (req, res, next) => {
    try {
      const services = await db.Service.findAll({
      
        include: [db.User, "Car"], // Include associated users in the query
      });
      // const result = services.map(service => ({
      //   ...service.dataValues,
      //   userName: service.User.userName // Access the associated user directly
      // }));
      res.json({
        historyData: services,
        // "userNames": result.map(e => e.userName),
        message: `history found , ${services.length} rentals`,
      });
    } catch (error) {
      next(error);
    }
  },

  getPendingHistory: async (req, res, next) => {
    try {
      const data = await db.Service.findAll({
        where: {
          acceptation: "pending",
        },
      });
      res.json({
        historyData: data,
        message: `history is found ${data.length} rentals`,
      });
    } catch (error) {
      next(error);
    }
  },
  getRejectedHistory: async (req, res, next) => {
    try {
      const data = await db.Service.findAll({
        where: {
          acceptation: "rejected",
        },
      });
      res.json({
        historyData: data,
        message: `history is found ${data.length} rentals`,
      });
    } catch (error) {
      next(error);
    }
  },
  CreateBooking: async function (req, res) {
    const { companyName,from , to ,CarId, UserId, startDate, endDate, amount, time,name,Email,phoneNumber,address,postalCode,city,flightNumber } = req.body;
    const conflictingRental = await db.Service.findOne({
      where: {
        CarId: CarId,
        startDate: { $lt: endDate },
        endDate: { $gt: startDate },
        ...(time ? { time: time } : {}),
      },
    });

    if (conflictingRental) {
      return res
        .status(400)
        .json({ message: "Car is not available for the selected dates." });
    }

    const datesInRange = getDatesInRange(startDate, endDate);
    const unavailableDates = await db.Availability.findAll({
      where: {
        CarId,
        date: datesInRange,
        isAvailable: false,
      },
    });

    if (unavailableDates.length > 0) {
      return res
        .status(400)
        .json({ message: "Selected date range is not available." });
    }

    const services = await db.Service.create({
      from,
      to,
      name,
      Email,
      CarId: CarId,
      UserId: UserId,
      startDate,
      endDate,
      amount,
      time: time || null,
      phoneNumber,
      address,
      postalCode,
      city,
      flightNumber ,
      companyName
    });

    for (const date of datesInRange) {
      await db.Availability.create({
        CarId,
        date,
        isAvailable: false,
      });
    }

    return res.json(services);
  },

  GetAvailableDatesForCar: async function (req, res) {
    try {
      const { oneCar } = req.params;
      const startDate = req.body.startDate;
      const endDate = req.body.endDate;

      const unavailableDates = await db.Availability.findAll({
        where: {
          CarId: oneCar,
          date: getDatesInRange(startDate, endDate),
          isAvailable: false,
        },
        attributes: ["date"],
      });

      const unavailableDateList = unavailableDates.map((date) => date.date);

      const availableDates = getDatesInRange(startDate, endDate).filter(
        (date) => !unavailableDateList.includes(date)
      );

      res.json(availableDates);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  GetUnavailableDatesForCar: async function (req, res) {
    try {
      const { oneCar } = req.params;

      const unavailableDates = await db.Availability.findAll({
        where: {
          CarId: oneCar,
          isAvailable: false,
        },
        attributes: ["date"],
      });

      const unavailableDateList = unavailableDates.map((date) => date.date);

      res.json(unavailableDateList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  UpdateService: async function (req, res) {
    try {
      const { id, acceptation } = req.body;

      const service = await db.Service.findByPk(id);

      if (!service) {
        return res.status(404).json({ message: "Service not found." });
      }

      if (service.acceptation !== "pending") {
        return res
          .status(400)
          .json({ message: "Service is already accepted or rejected." });
      }

      if (acceptation === "rejected") {
        const startDate = service.startDate;
        const endDate = service.endDate;

        const datesInRange = getDatesInRange(startDate, endDate);

        await db.Availability.destroy({
          where: {
            CarId: service.CarId,
            date: datesInRange,
          },
        });
      }

      await service.update({ acceptation });

      return res.json({ message: "Service updated successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  GetAllServicesForAgency: async function (req, res) {
    try {
      const { agencyId } = req.params;

      const services = await db.Car.findAll({
        where: {
          AgencyId: agencyId,
        },
        include: [
          {
            model: db.Agency,
            include: [
              {
                model: db.User,
                as: "User",
              },
            ],
          },
          {
            model: db.Service,
            include: [
              {
                model: db.User,
                as: "User",
              },
            ],
            where: { UserId: db.Sequelize.col("Agency.User.id") },
          },
          {
            model: db.Media,
            where: { CarId: db.Sequelize.col("Car.id") },
          },
          
        ],
        where: {
          "$Service.id$": { [db.Sequelize.Op.not]: null },
        },
      });

      return res.json(services);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  GetAvailableCars: async function (req, res) {
    try {
      const { startDate, endDate, price, characteristics, type, deposit } =
        req.body;

      const carBookings = await db.Service.findAll();
      const unavailableDates = await db.Availability.findAll({
        where: {
          date: getDatesInRange(startDate, endDate),
          isAvailable: false,
        },
        attributes: ["CarId"],
      });

      const unavailableCarIds = unavailableDates.map(
        (availability) => availability.CarId
      );

      const whereClause = {
        id: { [Op.notIn]: unavailableCarIds },
      };

      if (price) {
        whereClause.price = {
          [Op.between]: price,
        };
      }

      if (characteristics) {
        whereClause.characteristics = characteristics;
      }

      if (type) {
        whereClause.typevehicle = type;
      }

      if (deposit) {
        whereClause["Agency.deposit"] = {
          [Op.gte]: deposit,
        };
      }

      const availableCars = await db.Car.findAll({
        where: whereClause,
        include: [
          { model: db.Media, as: "Media" },
          { model: db.Agency, as: "Agency" },
        ],
      });

      res.json(availableCars);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  GetAllServicesForUser: async function (req, res) {
    try {
      const { userId } = req.params;

      const services = await db.Service.findAll({
        where: {
          UserId: userId,
        },
        include: [
          {
            model: db.Car,
            include: [
              { model: db.Media, as: "Media" },
              { model: db.Agency, as: "Agency" },
            ],
          },
        ],
      });

      return res.json(services);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  deletedServiceForagency: async function (req, res) {
    try {
      const deletedService = await db.Service.destroy({
        where: {
          CarId: req.params.CarId,
          id: req.params.id,
        },
      });
      return res.json(deletedService);
    } catch (error) {
      console.log(error);
    }
  },
  deletedServiceForUser: async function (req, res) {
    try {
      const deletedService = await db.Service.destroy({
        where: {
          UserId: req.params.UserId,
          id: req.params.id,
        },
      });
      return res.json(deletedService);
    } catch (error) {
      console.log(error);
    }
  },

  MarkDatesAsUnavailable: async function (req, res) {
    try {
      const { CarId, startDate, endDate } = req.body;
      const datesInRange = getDatesInRange(startDate, endDate);

      for (const date of datesInRange) {
        await db.Availability.create({
          CarId,
          date,
          isAvailable: false,
        });
      }

      return res.send("Dates marked as unavailable.");
    } catch (error) {
      console.error(error);
      throw new Error("Failed to mark dates as unavailable.");
    }
  },
  calculateTotalPrice: async function (req, res) {
    try {
      const { startDate, endDate, CarId } = req.body;

      // Calculate the duration between start date and end date in days
      const durationInDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));

      // Retrieve the price of the car
      const car = await db.Car.findOne({ where: { id: CarId } });
      const carPrice = car.price;

      // Calculate the total price
      const totalPrice = durationInDays * carPrice;

      res.status(200).send({ totalPrice });
    } catch (error) {
      res.json(error);
    }
  },
};
