const express = require("express");
const { add, getAll, remove , check} = require("../controller/BookMarks.controller");
const router = express.Router();

router.post("/add", add);
router.get("/getAll/:UserId", getAll);
router.get("/check/:UserId/:carId", check);
router.delete("/delete/:CarId", remove);

module.exports = router;
