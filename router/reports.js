const express = require("express");
const router = express.Router();
const { createReport, getAll } = require("../controller/report.controller");

router.get("/getAll", getAll);
router.post("/create", createReport);
module.exports = router;
