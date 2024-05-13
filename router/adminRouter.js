const {
  emailLogin,
  phoneLogin,
  getUserByEmail,
  getUserByPhoneNumber,
  handleToken,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
  SignUpAdmin,
  updateOneUserblockState,
  bringUsersData,
  getAllCompanies,
  getAllCars,
  getLimitedCars,
  getLimitedCompanies
} = require("../controller/Admin.controller");
const express = require("express");
const router = express.Router();

router.post("/emailLogin", emailLogin);
router.post("/useToken", handleToken);
router.post("/SignUpAdmin", SignUpAdmin);
router.get("/allUsers", getAllUsers);
router.get("/allCompanies", getAllCompanies);
router.get("/getLimitedCompanies", getLimitedCompanies);
router.get("/getAllCars", getAllCars);
router.get("/getLimitedCars", getLimitedCars);
router.put("/update/:id", updateOneUserblockState);

module.exports = router;
