const express = require("express");
const router = express.Router();
const {
  addCarMedia,
  getAllByCarId,
  addReqMedia,
  getAll,
  getAllByRequestId,
} = require("../controller/media.Controller");

router.post("/add/car/:id", addCarMedia);
router.post("/add/request/:id", addReqMedia);
router.get("/getAll", getAll);
router.get("/getAll/reqId", getAllByRequestId);
router.get("/getAll/carId", getAllByCarId);
module.exports = router;
