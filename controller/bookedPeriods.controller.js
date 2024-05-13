const { db } = require("../models/index");
const { Op } = require("sequelize");
module.exports = {
    getOneCar: async (req, res, next) => {
        try {
            const days = db.BookedPeriods.findAll({
                where: {
                    CarId: req.params.id
                }
            })
            res.status(200).send(days)
        } catch (error) {
            next(error)
        }
    },
    addOneCar: async (req, res, next) => {
        try {
            // Extract CarId and BookedPeriod from the request body
            const { CarId, BookedPeriod } = req.body;
    
            // Filter out any non-Date objects from the BookedPeriod array
            const validDates = BookedPeriod.filter(date => date instanceof Date);
    
            // Map over the valid dates to format each Date object as 'YYYY-MM-DD'
            const formattedBookedPeriods = validDates.map(date => {
                // Ensure the date is a valid Date object before formatting
                if (date instanceof Date) {
                    return date.toISOString().split('T')[0];
                } else {
                    // Handle the case where a non-Date object is encountered
                    console.error("Invalid date format:", date);
                    return null; // Or handle this case as appropriate for your application
                }
            }).filter(date => date!== null); // Filter out any null values from invalid dates
    
            // Map over the formatted dates to create an array of objects that match your model's schema
            const bookedPeriods = formattedBookedPeriods.map(date => ({
                CarId: CarId,
                BookedPeriod: date // Now this should be correctly formatted as 'YYYY-MM-DD'
            }));
    
            // Use bulkCreate to insert all booked periods into the database
            await db.BookedPeriods.bulkCreate(bookedPeriods);
    
            res.status(201).send({
                "status": "success" // Make sure to use quotes around success
            });
        } catch (error) {
            console.error("Error adding car booking:", error.message);
            console.error(error.stack); // This will print the stack trace, which can be very helpful for debugging
            throw error; // Rethrow the error to handle it in an error handling middleware
        }
    }
    
    
    
}