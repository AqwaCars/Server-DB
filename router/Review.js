const {
  BringAllReview,
  MakeReview,
  getAllByAgencyId,
  getAllRatingByCar,
} = require("../controller/Review.controller");
const express = require("express");
const router = express.Router();

router.get("/BringData", BringAllReview);
router.get("/getAllByAgencyId/:AgencyId", getAllByAgencyId);
router.post("/MakeReview/:receiverId", MakeReview);
router.get("/ratingByCar/:CarId", getAllRatingByCar);
module.exports = router;
