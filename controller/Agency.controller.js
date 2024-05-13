const { db } = require("../models/index");
const Agency = db.Agency;
const Request = db.Request;
const User = db.User;
module.exports = {
  fetchAll: async (req, res, next) => {
    try {
      const data = await Agency.findAll();
      res.status(200).send({
        data: data,
        message: "Data Found",
        status: "success",
      });
    } catch (er) {
      next(er);
    }
  },
  CreateAgency: async (req, res, next) => {
    try {
      const { reqId } = req.params;
      await Request.update({ verified: true }, { where: { id: reqId } });
      const request = await Request.findOne({
        where: { id: reqId },
        attributes: { exclude: ["id", "createdAt", "updatedAt"] },
      });
      const name = request.agencyName;
      delete request.agencyName;
      const agency = await Agency.create({
        ...request.dataValues,
        name: name,
        verificationStatus: true,
        requestId: reqId,
      });
      await User.update({ type: "agency" }, { where: { id: req.body.UserId } });
      res.status(201).send({
        status: "success",
        message: "agency added successfully!!!",
        data: agency,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  UpdateAgency: async (req, res) => {
    try {
      const { id } = req.params;
      await Agency.update(req.body, {
        where: {
          id: id,
        },
      });
      const agency = await Agency.findByPk(id);
      res.status(201).send(agency);
    } catch (err) {
      throw err;
      // res.status(500).json(err);
    }
  },
  getOneId: async (req, res, next) => {
    try {
      const agencyById = await db.Agency.findOne({
        where: { id: req.params.id * 1 },
      });
      const userid = await db.User.findOne({
        where: { id: agencyById.UserId * 1 },
      });

      console.log(agencyById, userid);
      res.status(200).send({ agencyById, userid });
    } catch (error) {
      throw error;
    }
  },
};
