const {
  CreateAgency,
  UpdateAgency,
  fetchAll,
  getOneId,
} = require("../controller/Agency.controller");
const express = require("express");
const router = express.Router();

router.get("/findAll", fetchAll);
router.get("/getOne/:id", getOneId);
router.put("/UpdateAgency/:id", UpdateAgency);
router.post("/addAgency/:reqId", CreateAgency);
module.exports = router;
