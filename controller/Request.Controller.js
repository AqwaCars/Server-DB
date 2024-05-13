const { db } = require("../models/index");
const Request = db.Request;
const Media = db.Media;

module.exports = {
  getAll: async (req, res) => {
    try {
      const response = await Request.findAll({
        include: Media,
      });
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  createRequest: async (req, res) => {
    try {
      console.log(req.body);
      const response = await Request.create({
        ...req.body,
        UserId: req.params.id,
      });
      res.status(201).send(response);
    } catch (err) {
      // res.status(500).json(err);
      throw err;
    }
  },
  // this is the controller that'll fetch all pending requests for the admin, each one will have all its images included
  getAllUnverifiedRequests: async (req, res,next) => {
    try {
      const response = await Request.findAll({
        where: { verified: false },
        include: Media,
      });
      res.status(200).send(response);
    } catch (err) {
      next(err)
    }
  },
  declineRequest: async (req, res,next) => {
    try {
      console.log(req.params);
      await Media.destroy({ where: { requestId: req.params.id } });
      await Request.destroy({ where: { id: req.params.id } });
      res.status(204).send("deleted");
    } catch (err) {
      next(err)
    }
  },
  AcceptRequest: async (req, res,next) => {
    try {
      const oldImg=await Media.destroy({ where: { requestId: req.params.id } });
      const oldReq=await Request.destroy({ where: { id: req.params.id } });
      res.status(204).send({oldImg,oldReq});
    } catch (err) {
      next(err);
    }
  }
};
