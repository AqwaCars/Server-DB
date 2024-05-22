const express = require("express");
const router = express.Router();
const {
  emailLogin,
  phoneLogin,
  getUserInfoByEmail,
  getUserByEmail,
  getUserByPhoneNumber,
  handleToken,
  getUserById,
  updateUser,
  deleteUser,
  SignUpUser,
  bringUsersData,
  checkPassword,
  sendResetPasswordConfirmationCode,
  reniewToken,
  bringSortedData,
  bringInvertedSortedData,
  sendOTPVerification,
  accountVerification,
  sendOTPForgetPassword,
  sendWelcomeEmail,
  forgetPassword,
  changePassword,
  SignUpCompany,
  deconnection,
  validatorUser,
  deconnectionFromDevices,
  verifyCurrentPass,
  changePasswordCRM,
  changePasswordCRMVerif
} = require("../controller/user.Controller");
const { verify } = require("crypto");

// Define routes for user operations
router.get("/sort/:DataType", bringSortedData);
router.get("/invSort/:DataType", bringInvertedSortedData);
router.get("/getById/:id", getUserById);
router.post("/emailLogin", emailLogin);
router.post("/phoneLogin", phoneLogin);
router.post("/token", handleToken);
router.get("/BringUserData", bringUsersData);
router.get("/getInfoByMail", getUserInfoByEmail);
router.post("/SignUpUser", SignUpUser);
router.post("/SignUpCompany", SignUpCompany);
router.get("/getOneByEmail/:email", getUserByEmail);
router.get("/getOneByPhone/:phoneNumber", getUserByPhoneNumber);

router.get("/getOne/:id", getUserById);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);
router.post("/passwordCheck/:id", checkPassword);
router.post(
  "/sendResetPasswordConfirmationCode",
  sendResetPasswordConfirmationCode
);
router.post("/reniewToken", reniewToken);
router.post("/sendVerificationEmail", sendOTPVerification)
router.post("/sendWelcomEmail", sendWelcomeEmail)
router.post("/sendForgetCode", sendOTPForgetPassword)
router.post("/verificationAccount", accountVerification)
router.post("/forgetPassword", forgetPassword)
router.post("/changePassword", changePassword)
router.post("/deconnection", deconnection)
router.post("/VerifyUser", validatorUser)
router.post("/deconnectionFromDevices", deconnectionFromDevices)
router.post("/verifyCurrentPass", verifyCurrentPass)
router.post("/changePasswordCRM", changePasswordCRM)
router.post("/changePasswordCRMVerif", changePasswordCRMVerif)

module.exports = router;
