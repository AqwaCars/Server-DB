const express = require("express");
const { getOneCar, addOneCar } = require("../controller/bookedPeriods.controller");
const router = express.Router();


router.post("/addOneCar", addOneCar);
router.get("/getOneCar/:id", getOneCar);

module.exports = router;
