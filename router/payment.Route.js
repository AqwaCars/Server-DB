const express = require("express");
const router = express.Router();
const {
  createStripe,
  createFlouci,
} = require("../controller/payment.Controller");

router.post("/intentsStripe", createStripe);
router.post("/intentsFlouci", createFlouci);
module.exports = router;
