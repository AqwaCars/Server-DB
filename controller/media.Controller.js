const { db } = require("../models/index");
const Media = db.Media;

module.exports = {
  addCarMedia: async (req, res) => {
    try {
      req.body.forEach((file) => (file.CarId = req.params.id));
      const media = await Media.bulkCreate(req.body);
      res.status(201).json({ mediaAdded: media.map((file) => file.id) });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getAllByCarId: async (req, res) => {
    try {
      const response = await Media.findAll({
        where: { CarId: req.params.carId },
      });
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  addReqMedia: async (req, res) => {
    try {
      req.body.forEach((file) => (file.requestId = req.params.id));
      const media = await Media.bulkCreate(req.body);
      res.status(201).json({ mediaAdded: media.map((file) => file.id) });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getAll: async (req, res) => {
    try {
      const response = await Media.findAll();
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getAllByRequestId: async (req, res) => {
    try {
      const response = await Media.findAll({
        where: { requestId: req.params.reqId },
      });
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
