const { db } = require("../models/index");
const { Op } = require("sequelize");

module.exports = {
    // getOneCar: async (req, res, next) => {
    //     try {
    //         const days = db.BookedPeriods.findAll({
    //             where: {
    //                 CarId: req.params.id
    //             }
    //         })
    //         res.status(200).send(days)
    //     } catch (error) {
    //         next(error)
    //     }
    // },
    // addOneCar: async (req, res, next) => {
    //     try {
    //         // Extract CarId and BookedPeriod from the request body
    //         const { CarId, BookedPeriod } = req.body;

    //         // Filter out any non-Date objects from the BookedPeriod array
    //         const validDates = BookedPeriod.filter(date => date instanceof Date);

    //         // Map over the valid dates to format each Date object as 'YYYY-MM-DD'
    //         const formattedBookedPeriods = validDates.map(date => {
    //             // Ensure the date is a valid Date object before formatting
    //             if (date instanceof Date) {
    //                 return date.toISOString().split('T')[0];
    //             } else {
    //                 // Handle the case where a non-Date object is encountered
    //                 console.error("Invalid date format:", date);
    //                 return null; // Or handle this case as appropriate for your application
    //             }
    //         }).filter(date => date!== null); // Filter out any null values from invalid dates

    //         // Map over the formatted dates to create an array of objects that match your model's schema
    //         const bookedPeriods = formattedBookedPeriods.map(date => ({
    //             CarId: CarId,
    //             BookedPeriod: date // Now this should be correctly formatted as 'YYYY-MM-DD'
    //         }));

    //         // Use bulkCreate to insert all booked periods into the database
    //         await db.BookedPeriods.bulkCreate(bookedPeriods);

    //         res.status(201).send({
    //             "status": "success" // Make sure to use quotes around success
    //         });
    //     } catch (error) {
    //         console.error("Error adding car booking:", error.message);
    //         console.error(error.stack); // This will print the stack trace, which can be very helpful for debugging
    //         throw error; // Rethrow the error to handle it in an error handling middleware
    //     }
    // }
    
    addDate: async (req, res) => {
        try {
            // Directly use req.body.dates as it's guaranteed to be an array
            console.log("HEYYYYYYYYYYYYYYYYYYYYYY", req.body);

            // Iterate over each date string in the array
            for (let i = 0; i < req.body.dates.length; i++) {
                // Parse the date string into a Date object
                const dateStr = req.body.dates[i]; // Assuming dates is an array of date strings
                const dateObj = new Date(Date.parse(dateStr));
            
                // Normalize the Date object to the start of the day (midnight)
                dateObj.setHours(0, 0, 0, 0);
            
                // Now, dateObj represents the start of the day for the original date string
                // Proceed to create the BookedPeriods entry with the normalized Date object
                await db.BookedPeriods.create({
                    CarId: req.body.carId, // Assuming you're passing the CarId in the request body
                    BookedPeriods: dateObj, // Use the normalized Date object here
                    UserId: req.body.userId,
                    rentalTime: req.body.rentalTime,
                    returnTime: req.body.returnTime,
                    BookingId:req.body.BookingId
                });
            }
            

            res.status(201).json({ message: "Dates added successfully" });
        } catch (error) {
            console.error("Error adding dates:", error);
            res.status(500).json({ message: "An error occurred while adding dates" });
        }
    },

    // Helper function to convert month names to month indices (0-indexed)

    removeRent: async (req, res) => {
        try {
            console.log(req.body);
            // Directly use req.body.dates as it's guaranteed to be an array
            // for (let date of req.body.dates) {
            await db.BookedPeriods.destroy({
                where: {
                    UserId: req.body.userId,
                    CarId: req.body.carId
                }
            });
            // }
            res.status(201).json({ message: "Dates Deleted successfully" });
        } catch (error) {
            console.error("Error deleting dates:", error);
            res.status(500).json({ message: "An error occurred while deleting dates" });
        }
    },
    getDate: async (req, res) => {
        try {
            // Check if CarId is provided in the request body
            if (!req.params.CarId) {
                console.log(req.body);
                console.log(" no id detected");
                return res.status(400).json({ message: "CarId is required" });
            }

            // Proceed with the query if CarId is provided
            const data = await db.BookedPeriods.findAll({
                where: {
                    CarId: req.params.CarId
                }
            });

            // Send the data along with a success message
            res.status(200).json({ data, message: "Dates fetched successfully" });
        } catch (er) {
            // Log the error and send a response indicating an internal server error
            res.status(500).json({ message: "An error occurred while fetching dates" });
            console.error("Error fetching dates:", er);
        }
    }

}