const express = require("express");
const router = express.Router();
const {
  createRequest,
  getAll,
  getAllUnverifiedRequests,
  declineRequest,
  AcceptRequest,
} = require("../controller/Request.Controller");

router.get("/getAll", getAll);
router.get("/getAllUnverified", getAllUnverifiedRequests);
router.post("/create/:id", createRequest);
router.delete("/decline/:id", declineRequest);
router.delete("/accept/:id", AcceptRequest);
module.exports = router;
