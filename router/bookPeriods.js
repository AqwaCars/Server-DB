const express = require("express");
const {  addDate,getDate, removeRent } = require("../controller/bookedPeriods.controller");
const router = express.Router();


router.post("/addDate", addDate);
router.get("/getDate/:CarId", getDate);
router.post("/removeRent", removeRent);

module.exports = router;
