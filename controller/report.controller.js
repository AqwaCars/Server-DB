const { db } = require("../models/index");
const Report = db.Report;

module.exports = {
    // this is the controller that'll fetch all Reports for the use, each one will have all its images included
    getAll: async (req, res, next) => {
        try {
            const response = await Report.findAll({
            });
            res.status(200).json(response);
        } catch (err) {
            next(err)
        }
    },
    
    createReport: async (req, res, next) => {
        try {
            const response = await Report.create(
                req.body
            );
            res.status(201).send(response);
        } catch (err) {
            next(err)
        }
    },
};
