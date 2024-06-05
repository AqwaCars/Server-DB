const { Op } = require("sequelize");
const { db } = require("../models/index");

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
      const services = await db.Booking.findAll({
        include: [db.User, db.Car], // Include associated users and cars in the query
      });
      res.json({
        historyData: services,
        message: `history found, ${services.length} rentals`,
      });
    } catch (error) {
      next(error);
    }
  },

  getPendingHistory: async (req, res, next) => {
    try {
      const data = await db.Booking.findAll({
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
      const data = await db.Booking.findAll({
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
    const {
      companyName,
      from,
      to,
      CarId,
      UserId,
      startDate,
      endDate,
      amount,
      time,
      name,
      Email,
      phoneNumber,
      address,
      postalCode,
      city,
      flightNumber,
      rentalTime,
      returnTime
    } = req.body;

    try {
      // Check for conflicting rentals
      const conflictingRental = await db.Booking.findOne({
        where: {
          CarId: CarId,
          startDate: { [Op.lt]: endDate },
          endDate: { [Op.gt]: startDate },
          ...(time ? { time: time } : {}),
        }
      });

      if (conflictingRental) {
        return res
          .status(400)
          .json({ message: "Car is not available for the selected dates." });
      }

      // Get dates in range
      const datesInRange = getDatesInRange(req.body.startDate, req.body.endDate);

      // Create the booking
      const booking = await db.Booking.create({
        from,
        to,
        name,
        Email,
        CarId,
        UserId,
        startDate,
        endDate,
        amount,
        time: time || null,
        phoneNumber,
        address,
        postalCode,
        city,
        flightNumber,
        companyName
      });

      // Create booked periods
      const bookedPeriods = datesInRange.map(date => ({
        CarId,
        UserId,
        BookedPeriods: date,
        rentalTime,
        returnTime
      }));
      // console.log("HEY MF HAKIM3", bookedPeriods,"dates are :", datesInRange);
      await db.BookedPeriods.bulkCreate(bookedPeriods);

      return res.json(booking);
    } catch (error) {
      console.error("Error occurred while creating the booking:", error);

      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(e => e.message);
        return res.status(400).json({ message: "Validation error", errors: validationErrors });
      }

      return res.status(500).json(JSON.stringify(error));
    }
  },
  CreateBookingAdmin: async function (req, res) {
    const {
      endDate,
      CarId,
      UserId,
      startDate,
      amount,
      time: returnTime,
      name,
      Email,
      phoneNumber,
      address,
      acceptation,
      postalCode,
      city,
    } = req.body;
    try {
      console.log("jijiiji", req.body.startDate, req.body.endDate);
      // Check for conflicting rentals
      const conflictingRental = await db.Booking.findOne({
        where: {
          CarId: CarId,
          startDate: { [Op.lt]: endDate },
          endDate: { [Op.gt]: startDate },
          // time: req.body.time ? req.body.time : null,
        }
      });
      console.log("zok omek", conflictingRental);
      if (conflictingRental) {
        return res
          .status(400)
          .json({ message: "Car is not available for the selected dates." });
      }
      // // Get dates in range
      // const datesInRange = getDatesInRange(req.body.startDate, req.body.endDate);

      // Create the booking
      const booking = await db.Booking.create(req.body);

      // Create booked periods
      // const bookedPeriods = datesInRange.map(date => ({
      //   CarId,
      //   UserId,
      //   BookedPeriods: date,
      //   rentalTime,
      //   returnTime
      // }));
      // // console.log("HEY MF HAKIM3", bookedPeriods,"dates are :", datesInRange);
      // await db.BookedPeriods.bulkCreate(bookedPeriods);

      return res.json(booking);
    } catch (error) {
      console.error("Error occurred while creating the booking:", error);

      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(e => e.message);
        return res.status(400).json({ message: "Validation error", errors: validationErrors });
      }

      return res.status(500).json(JSON.stringify(error));
    }
  },

  getAllBooking: async (req,res,next) => {
    try {
      const response = await db.Booking.findAll({
        where: { acceptation: "pending" },
      });
      res.status(200).send(response);
    } catch (err) {
      next(err)
    }
  },
  getAllBookingsByUserId: async (req, res) => {
    const { UserId } = req.params;
    const { acceptation } = req.body;

    try {
      // Build the filter conditionally based on the acceptation status
      let whereCondition = { UserId };
      if (acceptation) {
        whereCondition = { ...whereCondition, acceptation };
      }

      const bookings = await db.Booking.findAll({
        where: whereCondition,
        include: [
          {
            model: db.Car,
            as: 'Car'
          }
        ],
      });

      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: "No bookings found for the given user." });
      }

      return res.json(bookings);
    } catch (error) {
      console.error("Error occurred while fetching bookings:", JSON.stringify(error));
      return res.status(500).json({ message: "An error occurred while fetching the bookings.", error: error });
    }
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

      const service = await db.Booking.findByPk(id);

      if (!service) {
        return res.status(404).json({ message: "Service not found." });
      }

      if (service.acceptation !== "pending") {
        return res
          .status(400)
          .json({ message: "Service is already accepted or rejected." });
      }

      // if (acceptation === "rejected") {
      //   const startDate = service.startDate;
      //   const endDate = service.endDate;

        // const datesInRange = getDatesInRange(startDate, endDate);

        // await db.Availability.destroy({
        //   where: {
        //     CarId: service.CarId,
        //     date: datesInRange,
        //   },
        // });
      // }

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
            model: db.Booking,
            include: [
              {
                model: db.User,
                as: "User",
              },
            ],
            where: { UserId: Sequelize.col("Agency.User.id") },
          },
          {
            model: db.Media,
            where: { CarId: Sequelize.col("Car.id") },
          },

        ],
        where: {
          "$Booking.id$": { [Sequelize.Op.not]: null },
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
      const { startDate, endDate, price, typeOfFuel, Category, Type } = req.body;

      const unavailableDates = await db.BookedPeriods.findAll({
        where: {
          BookedPeriods: getDatesInRange(startDate, endDate)
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

      if (typeOfFuel) {
        whereClause.typeOfFuel = typeOfFuel;
      }

      if (Category) {
        whereClause.Category = Category;
      }

      if (Type) {
        whereClause.Type = Type;
      }

      const availableCars = await db.Car.findAll({
        where: whereClause,
        // include: [
        //   { model: db.Media, as: "Media" },
        //   { model: db.Agency, as: "Agency" },
        // ],
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

      const services = await db.Booking.findAll({
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
      const deletedService = await db.Booking.destroy({
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
      const deletedService = await db.Booking.destroy({
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
