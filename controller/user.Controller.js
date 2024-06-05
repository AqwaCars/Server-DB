require("dotenv").config();
const { db } = require("../models/index");
const User = db.User;
const Token = db.Token;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { Sequelize, Op } = require("sequelize");

// Controller methods for User
module.exports = {
  bringUsersData: async (req, res, next) => {
    try {
      const Users = await db.User.findAll();
      res.json(Users);
    } catch (error) {
      next(error);
    }
  },
  bringSortedData: async (req, res, next) => {
    try {
      console.log("Type : ", req.params.DataType === "createdAt");
      const list = await db.User.findAll({
        order: [
          req.params.DataType === "A-Z"
            ? ["userName", "ASC"]
            : req.params.DataType === "createdAt"
            ? ["createdAt", "ASC"]
            : req.params.DataType === "carsRented"
            ? ["carsRented", "ASC"]
            : null,
        ],
      });
      list ? res.json(list) : res.json([]);
    } catch (error) {
      next(error);
    }
  },
  bringInvertedSortedData: async (req, res, next) => {
    try {
      const list = await db.User.findAll({
        order: [
          req.params.DataType === "A-Z-desc"
            ? ["userName", "DESC"]
            : req.params.DataType === "createdAt-desc"
            ? ["createdAt", "DESC"]
            : req.params.DataType === "carsRented-desc"
            ? ["carsRented", "DESC"]
            : null,
        ],
      });
      res.json(list);
    } catch (error) {
      next(error);
    }
  },

  SignUpCompany: async (req, res, next) => {
    try {
      const NameCheck = await db.User.findAll({
        where: {
          userName: req.body.userName,
        },
      });
      const emailCheck = await db.User.findAll({
        where: {
          email: req.body.email,
        },
      });
      if (NameCheck[0] || emailCheck[0]) {
        if (NameCheck[0]) {
          return res.status(403).send({
            status: "Blocked",
            message: "This UserName Already Exists",
            found: NameCheck,
          });
        }
        if (emailCheck[0]) {
          return res.status(403).send({
            status: "Blocked",
            message: "This Email Already Exists",
            found: emailCheck,
          });
        }
      } else {
        const Company = await db.User.create(req.body);
        res.status(201).send({
          status: "success",
          message: "Company added successfully!!!",
          data: Company,
        });
      }
    } catch (err) {
      next(err);
    }
  },

  SignUpUser: async (req, res) => {
    const {
      userName,
      phoneNumber,
      password,
      confirmPassword,
      email,
      dateOfBirth,
      selfie,
      drivingLicenseFront,
      drivingLicenseBack,
      passport,
      cardIdBack,
      cardIdFront,
    } = req.body;

    if (
      !userName ||
      !phoneNumber ||
      !password ||
      !confirmPassword ||
      !email ||
      !dateOfBirth ||
      !selfie ||
      !drivingLicenseFront ||
      !drivingLicenseBack ||
      !cardIdFront ||
      !cardIdBack
    ) {
      return res.status(422).json({ error: "fill all the details" });
    }

    try {
      const findUser = await User.findOne({
        where: { email, isArchived: false },
      });
      const findUserByPhone = await User.findOne({
        where: { phoneNumber, isArchived: false },
      });

      if (findUser) {
        return res.status(409).json({ error: "This email is already existed" });
      } else if (findUserByPhone) {
        return res
          .status(409)
          .json({ error: "This phone number is already existed" });
      } else if (password !== confirmPassword) {
        return res
          .status(422)
          .json({ error: "Password and confirm password are not match" });
      } else {
        const finalUser = await User.create({
          userName,
          phoneNumber,
          password,
          email,
          dateOfBirth,
          selfie,
          drivingLicenseFront,
          drivingLicenseBack,
          cardIdFront,
          cardIdBack,
          passport: passport || null, 
        });

        res.status(201).json(finalUser);
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Internal server error", details: error.message });
    }
  },


  emailLogin: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(422)
        .json({ error: "Please provide email and password" });
    }

    try {
      const userValid = await User.findOne({
        where: { email, isArchived: false },
      });

      if (!userValid) {
        return res.status(404).json({ error: "User not found" });
      }
      const isMatch = await bcrypt.compare(password, userValid.password);
      if (isMatch && userValid.isBlocked) {
        return res.status(403).json({
          error: "Account is blocked",
        });
      }
      if (isMatch && userValid.isArchived) {
        return res.status(403).json({
          error: "User not found",
        });
      }
      if (isMatch && !userValid.isVerified) {
        return res.status(403).json({
          error: "Account not verified. Please verify your email address",
        });
      }
      if (isMatch && userValid.type !== "user") {
        return res.status(403).json({
          error: "User not found",
        });
      }
      if (!isMatch) {
        return res.status(422).json({ error: "Invalid email or password" });
      }

      // const token = jwt.sign(userValid.id, process.env.JWT_SECRET_KEY);
      if (
        isMatch &&
        userValid.isVerified &&
        !userValid.isBlocked &&
        !userValid.isArchived
      ) {
        const token = await jwt.sign(
          { id: userValid.id },
          process.env.JWT_SECRET_KEY
        );

        const result = {
          id: userValid.id,
          email: userValid.email,
          token,
        };

        const AddToken = await db.Token.create({
          token: token,
          UserId: userValid.id,
        });
        res.status(200).json({ status: 200, result });
      }
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  accountVerification: async (req, res) => {
    const { email, otpCode } = req.body;

    try {
      const user = await User.findOne({ where: { email, isArchived: false } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.verificationOTP !== otpCode) {
        return res.status(400).json({ error: "Incorrect OTP code" });
      }

      const updateUser = await User.update(
        { verificationOTP: null },
        { where: { email } }
      );
      const VerifyUser = await User.update(
        { isVerified: true },
        { where: { email } }
      );

      return res
        .status(200)
        .json({ message: "OTP code verified successfully" });
    } catch (error) {
      console.error("Error verifying OTP code:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  sendOTPVerification: async (req, res) => {
    const { email } = req.body;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    try {
      const user = await User.findOne({ where: { email, isArchived: false } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Generate a 6-digit OTP code
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      // Update the user with the new OTP code
      await User.update({ verificationOTP: code }, { where: { email } });

      // Define the HTML content of the email
      const htmlContent = `
        <div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2">
          <div style="margin: 50px auto; width: 70%; padding: 20px 0">
            <div style="border-bottom: 1px solid #eee">
              <img src="https://res.cloudinary.com/dl9cp8cwq/image/upload/fl_preserve_transparency/v1716470902/car_images/aqwa_cars_black_hpvbaw.jpg?_s=public-apps" alt="Your Brand Logo" style="max-width: 100%; display: block;" />
            </div>
            <p style="font-size: 1.1em">Hi ${user.userName},</p>
            <p>Thank you for choosing aqwa Cars. Use the following OTP to complete your Sign Up procedures.</p>
            <h2 style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">${code}</h2>
            <p style="font-size: 0.9em;">Regards,<br />aqwa Cars</p>
            <hr style="border: none; border-top: 1px solid #eee" />
            <div style="float: right; padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300">
              <p>aqwa cars S.A.R.L</p>
              <p>IMMEUBLE EL FAWZ, AV DU DIRHAM</p>
            <p>LES BERGES DU LAC 2</p>
            <p>TUNIS</p>
            </div>
          </div>
        </div>
      `;

      // Define the mail options
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Account Verification Code",
        html: htmlContent,
      };

      // Send the email
      await transporter.sendMail(mailOptions);

      console.log("Email sent successfully");
      return res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Failed to send email:", error);
      return res.status(500).json({ error: "Failed to send email" });
    }
  },
  sendOTPForgetPassword: async (req, res) => {
    const { email } = req.body;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    try {
      const user = await User.findOne({ where: { email, isArchived: false } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const updateUser = await User.update(
        { forgetPasswordOTP: code },
        { where: { email } }
      );

      const htmlContent = `
      <div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2">
        <div style="margin: 10px auto; width: 70%; padding: 20px 0">
          <div style="border-bottom: 1px solid #eee">
            <img src="https://res.cloudinary.com/dl9cp8cwq/image/upload/fl_preserve_transparency/v1716470902/car_images/aqwa_cars_black_hpvbaw.jpg?_s=public-apps" alt="Your Brand Logo" style="max-width: 100%; display: block;" />
          </div>
          <p style="font-size: 1.1em">Hi ${user.userName},</p>
          <p>We received a request to reset your password. Use the following OTP to reset your password:</p>
          <h2 style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">${code}</h2>
          <p style="font-size: 0.9em;">If you didn't request a password reset, you can ignore this email.</p>
          <p style="font-size: 0.9em;">Regards,<br />aqwa Cars</p>
          <hr style="border: none; border-top: 1px solid #eee" />
          <div style="float: right; padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300">
            <p>aqwa Cars S.A.R.L</p>
            <p>IMMEUBLE EL FAWZ, AV DU DIRHAM</p>
            <p>LES BERGES DU LAC 2</p>
            <p>TUNIS</p>
          </div>
        </div>
      </div>
    `;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset Password Code",
        html: htmlContent,
      };

      await transporter.sendMail(mailOptions);

      console.log("Email sent successfully");
      return res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to send email" });
    }
  },
  sendWelcomeEmail: async (req, res) => {
    const { email } = req.body;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    try {
      const user = await User.findOne({ where: { email, isArchived: false } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const htmlContent = `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
      "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>Welcome to aqwa Cars</title>
  <style type="text/css">
      @media only screen and (min-width:480px) {
          .mj-column-per-100 { width:100%!important; }
          .mj-column-per-33 { width:33.333333333333336%!important; }
          .mj-column-per-50 { width:50%!important; }
          .mj-column-per-8 { width:8%!important; }
          .mj-column-px-600 { width:600px!important; }
      }
  </style>
</head>
<body>
<div>
  <!--[if mso | IE]>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;">
      <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
  <![endif]-->
  <div style="margin:0px auto;max-width:600px;"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:20px 0px;"><!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;">
      <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-break:break-word;font-size:0px;padding:10px 25px;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"><tbody><tr><td style="width:600px"><img alt="" title="" height="auto" src="https://res.cloudinary.com/dl9cp8cwq/image/upload/v1717509958/apk_images/Untitled_design_85_r5zzcs.png" style="border:none;border-radius:;display:block;outline:none;text-decoration:none;width:100%;height:auto;" width="600"></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]>
      </td></tr></table>
      <![endif]--></td></tr></tbody></table></div><!--[if mso | IE]>
  </td></tr></table>
  <![endif]-->
  <!--[if mso | IE]>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;">
      <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
  <![endif]--><div style="margin:0px auto;max-width:600px;"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:20px 0px;"><!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;">
      <![endif]--><div class="mj-column-px-600 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left"><div class="" style="cursor:auto;color:#117CA8;font-family:Helvetica;font-size:20px;font-weight:bold;line-height:22px;text-align:left;">Hi ${user.userName},</div></td></tr><tr><td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left"><div class="" style="cursor:auto;color:#525252;font-family:Helvetica;font-size:16px;line-height:22px;text-align:left;">
         Thank you for choosing Aqwa Cars, Tunisia's leading and exclusive car rental service! We are delighted to welcome you and are committed to ensuring you have the best possible experience with our platform.
      </div></td></tr><tr><td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left"><div class="" style="cursor:auto;color:#525252;font-family:Helvetica;font-size:16px;line-height:22px;text-align:left;">
          To get started, please open our mobile application and log in with the following credentials:


      </div></td></tr><tr><td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left"><div class="" style="cursor:auto;color:#525252;font-family:Helvetica;font-size:16px;line-height:22px;text-align:left;">
          <b>Account:</b> [AccountName]
          <br>
          <b>Phone Number:</b> [PhoneNumber]
          <br>
          <b>Email:</b> [Email]
      </div></td></tr><tr><td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left"><div class="" style="cursor:auto;color:#525252;font-family:Helvetica;font-size:16px;line-height:22px;text-align:left;">
          At Aqwa Cars, we pride ourselves on offering a diverse selection of vehicles to suit all your travel needs. Whether you're looking for a compact car for efficient city driving or a spacious SUV for a family getaway, we have the perfect vehicle for every occasion.
      </div></td></tr>
      <![endif]--><tr><td style="word-break:break-word;font-size:0px;padding:10px 0px 10px 35px;" align="left"><div class="" style="cursor:auto;color:#000000;font-family:Helvetica;font-size:12px;line-height:22px;text-align:left;">
          <mj-raw>
              <p style="margin: 0;"><img src="https://app.kometsales.com/img/template/email-welcome/icon-mail.png"> <span style="display: inline-block; height: 30px; line-height: 7px; vertical-align: middle;">Email us at <a href="mailto:info@aqua-cars.com" style="color:#117CA8;">info@aqua-cars.com</a> </span> </p>
              <p style="margin: 0;"><img src="https://app.kometsales.com/img/template/email-welcome/icon-chat.png"> <span style="display: inline-block; height: 30px; line-height: 7px; vertical-align: middle;">Chat with the aqwa Cars Team.</span> </p>
              <p style="margin: 0;"><img src="https://app.kometsales.com/img/template/email-welcome/icon-tel.png"> <span style="display: inline-block; height: 30px; line-height: 7px; vertical-align: middle;">Call us at +216 93 933 343</span> </p>
              <mj-raw>
              </mj-raw></mj-raw></div></td></tr></tbody></table></div><!--[if mso | IE]>
      </td><td style="vertical-align:top;width:300px;">
      <![endif]-->
  </td></tr></table>
 
                      </tbody></table><!--CloserSectionTable-->
                      
                     <!--SpacerTable-->

                      
  <table id="AppBadgeTable" border="0" cellspacing="0" cellpadding="0" width="100%" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
      <tbody><tr>
          <td align="right" style="border-collapse:collapse;font-family:Helvetica, Arial, sans-serif;">
              <a href="https://itunes.apple.com/app/apple-store/id447374873?mt=8" target="_blank" style="font-size:16px;line-height:1.5;font-weight:bold;color:#76B71A;text-align:center;">
                  <img alt="App Store" class="image_fix" style="outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border:none;display:block;float: right;" height="45" width="139" border="0" src="https://s3.amazonaws.com/static.komoot.de/email/appstore/appstore-en@2x.png"></a>
          </td>
          <td width="10" style="border-collapse:collapse;font-family:Helvetica, Arial, sans-serif;"></td>
          <td align="left" style="border-collapse:collapse;font-family:Helvetica, Arial, sans-serif;">
              <a href="https://play.google.com/store/apps/details?id=de.komoot.android&amp;referrer=utm_source%3Dwelcome-mail%26utm_medium%3Demail%26utm_campaign%3Dwelcome-mails" target="_blank" style="font-size:16px;line-height:1.5;font-weight:bold;color:#76B71A;text-align:center;">
                  <img alt="Play Store" class="image_fix" style="outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border:none;display:block;float: left;" height="45" width="139" border="0" src="https://s3.amazonaws.com/static.komoot.de/email/appstore/google-play-en@2x.png"></a>
          </td>
      </tr>
  </tbody></table>

                      
                      <table id="SpacerTable" border="0" cellspacing="" cellpadding="0" bgcolor="#F2F2F2" width="50%" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; background-color:#FFFFFF; width:100%!important;">
                         <tbody><tr><td height="40" style="border-collapse: collapse;"></td></tr>
                      </tbody></table><!--SpacerTable-->

                      <table id="SocialTable" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" width="100%" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:100%!important;">
                         <tbody><tr>
                            <td align="center" valign="top" style="border-collapse:collapse;font-family:Helvetica, Arial, sans-serif;">
                           <table id="FollowUsTable" border="0" cellspacing="0" cellpadding="0" width="100%" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                                  <tbody><tr>
                                     <td width="60" style="border-collapse:collapse;font-family:Helvetica, Arial, sans-serif;font-size:16px;line-height:1;font-weight:bold;color:#707070;text-align:center;"></td>
                                     <td align="center" valign="middle" style="border-collapse:collapse;font-family:Helvetica, Arial, sans-serif;font-size:16px;line-height:1;font-weight:bold;color:#707070;text-align:center;">
                                        <table id="GreyLine" border="0" cellspacing="0" cellpadding="0" width="100%" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;background-color:#ECECEC;">
                                           <tbody><tr>
                                              <td height="1" width="200" style="border-collapse:collapse;font-family:Helvetica, Arial, sans-serif;font-size:16px;line-height:1;font-weight:bold;color:#707070;text-align:center;"></td>
                                           </tr>
                                        </tbody></table>
                                     </td>
                                     <td width="120" align="center" valign="middle" style="border-collapse:collapse;font-family:Helvetica, Arial, sans-serif;font-size:16px;line-height:1;font-weight:bold;color:#707070;text-align:center;">
                                        
                                           Follow Us
                                        
                                     </td>
                                     <td align="center" valign="middle" style="border-collapse:collapse;font-family:Helvetica, Arial, sans-serif;font-size:16px;line-height:1;font-weight:bold;color:#707070;text-align:center;">
                                        <table id="GreyLine" border="0" cellspacing="0" cellpadding="0" width="100%" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;background-color:#ECECEC;">
                                           <tbody><tr>
                                              <td height="1" width="200" style="border-collapse:collapse;font-family:Helvetica, Arial, sans-serif;font-size:16px;line-height:1;font-weight:bold;color:#707070;text-align:center;"></td>
                                           </tr>
                                        </tbody></table>
                                     </td>
                                     <td width="60" style="border-collapse:collapse;font-family:Helvetica, Arial, sans-serif;font-size:16px;line-height:1;font-weight:bold;color:#707070;text-align:center;"></td>
                                  </tr>
                               </tbody></table>
                            </td>
                         </tr>
                         <tr>
                            <td height="30" style="border-collapse:collapse;font-family:Helvetica, Arial, sans-serif;"></td>
                         </tr>
                         <tr>
                            <td style="border-collapse:collapse;font-family:Helvetica, Arial, sans-serif;">
                               <table id="SocialIconsTable" border="0" cellspacing="0" cellpadding="0" width="100%" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                                  <tbody><tr>
                                     <td style="border-collapse:collapse;font-family:Helvetica, Arial, sans-serif;">&nbsp;</td>
                                     <td width="36" align="center" valign="middle" style="border-collapse:collapse;font-family:Helvetica, Arial, sans-serif;">
                                        <a href="https://www.tiktok.com/@aqwacars1" target="_blank" style="font-size:16px;line-height:1.5;font-weight:bold;color:#76B71A;text-align:center;">
                                           <img alt="TikTok" class="image_fix" height="37" width="36" border="0" src="https://res.cloudinary.com/dl9cp8cwq/image/upload/fl_preserve_transparency/v1716478396/Your_paragraph_text_hxvro7.jpg?_s=public-apps" style="outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border:none;display:block;"></a>
                                     </td>
                                     <td width="30" style="border-collapse:collapse;font-family:Helvetica, Arial, sans-serif;"></td>
                                     <td width="36" align="center" valign="middle" style="border-collapse:collapse;font-family:Helvetica, Arial, sans-serif;">
                                        <a href="https://www.instagram.com/aqwa.cars/?hl=fr" target="_blank" style="font-size:16px;line-height:1.5;font-weight:bold;color:#76B71A;text-align:center;">
                                           <img alt="Instagram" class="image_fix" height="37" width="36" border="0" src="https://s3.amazonaws.com/static.komoot.de/email/inspire/ic-social-instagram@2x.png" style="outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border:none;display:block;"></a>
                                     </td>
                                  
                                  
                                        <td style="border-collapse:collapse;font-family:Helvetica, Arial, sans-serif;">&nbsp;</td>
                                  </tr>
                               </tbody></table>
                            </td>
                         </tr>
                      </tbody></table>

                      <table id="SpacerTable" border="0" cellspacing="0" cellpadding="0" bgcolor="#F2F2F2" width="100%" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; background-color:#FFFFFF; width:100%!important;">
                         <tbody><tr><td height="40" style="border-collapse: collapse;"></td></tr>
                      </tbody></table><!--SpacerTable-->

                      
                         <table id="FooterTable" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" width="100%" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; background-color:#FFFFFF; width:100%!important;">
                            <tbody><tr>
                               <td width="20" style="border-collapse: collapse;"></td>
                               <td align="center" style="border-collapse: collapse; font-family: Helvetica, Arial, sans-serif; font-size:12px; line-height:1.4; font-weight: normal; color: #999999; text-align: center;">

                                  You’ve received this Welcome Email because you signed up for komoot. Tired of us already? You can unsubscribe at any time. If you’d like to unsubscribe from all komoot communication, please change your settings.

                               </td>
                               <td width="20" style="border-collapse: collapse;"></td>
                            </tr>
                            <tr><td colspan="3" height="20" style="border-collapse: collapse;"></td></tr>
                            <tr>
                               <td width="20" style="border-collapse: collapse;"></td>
                               <td align="center" style="border-collapse: collapse; font-family: Helvetica, Arial, sans-serif; font-size:12px; line-height:1.4; font-weight: normal; color: #999999; text-align: center;">
                                  <div class="vcard">
                                     <span class="org fn">aqwa Cars S.A.R.L</span> • <span class="adr"><span class="street-address">Friedrich-Wilhelm-Boelcke-Straße 2</span> • <span class="postal-code">14473</span> <span class="locality">Potsdam</span><br>
                                        <a style="color: #999999; text-decoration: underline;" href="https://www.aqwa-cars.com" target="_blank" class="url">www.aqwa-cars.com</a> • <a class="email" style="color: #999999; text-decoration: underline;" href="mailto:help@komoot.de" target="_blank">help@aqwa-cars.com</a></span>
                                  </div>
                               </td>
                               <td width="20" style="border-collapse: collapse;"></td>
                            </tr>
                            <tr><td colspan="3" height="20" style="border-collapse: collapse;"></td></tr>
                         </tbody></table><!--FooterTable-->
                      

                     <!--SpacerTable-->

                   </td>
                </tr>
             </tbody></table><!--ColumnTable-->
          </td>
       </tr></body>
</html>
    `;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Welcome To Aqua Cars!",
        html: htmlContent,
      };

      await transporter.sendMail(mailOptions);

      console.log("Email sent successfully");
      return res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to send email" });
    }
  },
  forgetPassword: async (req, res) => {
    const { email, otpCode } = req.body;

    try {
      const user = await User.findOne({ where: { email, isArchived: false } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.forgetPasswordOTP !== otpCode) {
        return res.status(400).json({ error: "Incorrect OTP code" });
      }
      if (user.forgetPasswordOTP === otpCode) {
        const updateUser = await User.update(
          { forgetPasswordOTP: null },
          { where: { email } }
        );

        return res
          .status(200)
          .json({ message: "OTP code verified successfully" });
      }
    } catch (error) {
      console.error("Error verifying OTP code:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  phoneLogin: async (req, res) => {
    try {
      const user = await User.findOne({
        where: { phoneNumber: req.body.phoneNumber },
      });
      if (!user) {
        return res.status(404).json("user does not exist");
      }
      if (!(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(401).json("wrong password");
      }
      const token = jwt.sign(user.dataValues, process.env.JWT_SECRET_KEY);
      res.send(token);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  // gets users token from the front to verify it and sends it back to front
  handleToken: async (req, res) => {
    try {
      const response = jwt.verify(req.body.token, process.env.JWT_SECRET_KEY);
      delete response.password;
      console.log(response.type);
      if (response.type === "agency") {
        const task = await User.findOne({
          where: { email: response.email },
          include: ["Agency"],
        });
        if (task) {
          delete task.password;
        }
        res.json(task);
      } else {
        res.status(200).json(response);
      }
    } catch (err) {
      res.json(err);
    }
  },

  // gets users token from the front to verify it and sends it back to front
  reniewToken: async (req, res) => {
    try {
      const { token } = req.body;
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const { id } = decoded;
      const user = await User.findByPk(id);
      // const newToken = jwt.sign(user.dataValues, process.env.JWT_SECRET_KEY);
      const newToken = jwt.sign(user.id, process.env.JWT_SECRET_KEY);
      res.status(200).send(newToken);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  // Get all user info by email
  getUserInfoByEmail: async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({
        where: { email },
      });
      if (!user) {
        return res.status(404).json({ error: "user not found" });
      }
      res.status(200).send(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // checks by email if a user exists in database
  getUserByEmail: async (req, res) => {
    try {
      const user = await User.findOne({ where: { email: req.params.email } });
      if (!user) {
        return res.status(404).json("user does not exist");
      }
      res.status(200).send("user exists");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // checks by phone number if a user exists in database
  getUserByPhoneNumber: async (req, res) => {
    try {
      const user = await User.findOne({
        where: { phoneNumber: req.params.phoneNumber },
      });
      if (!user) {
        return res.status(404).json("user does not exist");
      }
      res.status(200).send("user exists");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get a specific user by ID
  getUserById: async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await User.findByPk(userId);
      if (user) {
        console.log("here controller selim ", user);
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      res.json(err);
    }
  },

  // Update a user by ID
  updateUser: async (req, res) => {
    try {
      const userId = req.params.id;
      if (req.body.hasOwnProperty("password")) {
        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.update(
          { ...req.body, password: hashedPassword },
          {
            where: { id: userId },
          }
        );
      } else {
        await User.update(req.body, {
          where: { id: userId },
        });
      }
      const user = await User.findByPk(userId, {
        attributes: { exclude: "password" },
      });
      res.status(201).send(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a user by ID
  deleteUser: async (req, res) => {
    const userId = req.params.id;
    try {
      const deleted = await User.destroy({
        where: { id: userId },
      });
      if (deleted) {
        res.json({ message: "User deleted" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      res.json(err);
    }
  },

  // I made this controller just to get a password and compare it with the one in the data base and check if it's true or not
  checkPassword: async (req, res) => {
    try {
      const { password } = req.body;
      const { id } = req.params;
      const user = await User.findOne({ where: { id: id } });
      const response = await bcrypt.compare(password, user.password);
      console.log(response);
      if (!response) {
        return res.send("no match");
      }
      return res.status(200).send("match");
    } catch (err) {
      res.status(500).json(err);
    }
  },
  sendResetPasswordConfirmationCode: async (req, res) => {
    let code = "";
    for (let digit = 0; digit < 5; digit++) {
      code += Math.floor(Math.random() * 10);
    }
    const { email } = req.body;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      host: "smtp.gmail.com",
      auth: {
        user: "rentngo.c4@gmail.com",
        pass: "wdeg xkok redv naue",
      },
      secure: true, // true for 465, false for other ports
    });
    const mailOptions = {
      from: "Rent & Go rentngo.c4@gmail.com",
      to: email,
      subject: "Reset Password",
      text: `This is your confirmation code: ${code}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      // if (err) res.status(500).send(err);
      if (err) throw err;
      else res.status(201).send(code);
    });
  },
  confirmResetPasswordConfirmationCode: async (req, res) => {
    try {
    } catch (err) {
      res.status(500).json(err);
    }
  },
  changePassword: async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;

    try {
      if (!email || !newPassword || !confirmPassword) {
        return res.status(400).json({
          error: "Please provide email, new password, and confirm password",
        });
      }

      if (newPassword !== confirmPassword) {
        return res
          .status(422)
          .json({ error: "New password and confirm password do not match" });
      }

      const user = await User.findOne({ where: { email, isArchived: false } });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isMatch = await bcrypt.compare(newPassword, user.password);

      if (isMatch) {
        return res
          .status(422)
          .json({ error: "Please choose a different password" });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      const updateUser = await User.update(
        { password: hashedNewPassword },
        { where: { email } }
      );

      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  verifyCurrentPass: async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;

    try {
      if (!email || !newPassword || !confirmPassword) {
        return res.status(400).json({
          error: "Please provide email, new password, and confirm password",
        });
      }

      if (newPassword !== confirmPassword) {
        return res
          .status(422)
          .json({ error: "New password and confirm password do not match" });
      }

      const user = await User.findOne({ where: { email, isArchived: false } });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isMatch = await bcrypt.compare(newPassword, user.password);

      if (isMatch) {
        return res
          .status(422)
          .json({ error: "Please choose a different password" });
      }
      res.status(200).json({ message: "You can change your password" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  deconnection: async (req, res) => {
    const { token } = req.body;

    try {
      const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      // console.log(verifyToken.id,"This is token");

      const tokens = await Token.findAll({
        where: { UserId: verifyToken.id, token: token },
      });

      if (tokens.length > 0) {
        await Token.destroy({
          where: { UserId: verifyToken.id, token: token },
        });
        res
          .status(200)
          .json({ status: 200, message: "Token successfully deleted" });
      } else {
        res.status(404).json({ error: "Token not found" });
      }
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        res.status(403).json({ error: "Invalid token" });
      } else {
        console.error("Error during deconnection:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
  validatorUser: async (req, res) => {
    const { token } = req.body;
    try {
      const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log(verifyToken.id, "This is token");

      const tokens = await Token.findAll({
        where: { UserId: verifyToken.id, token: token },
      });
      if (tokens.length > 0) {
        res.status(200).json({ status: 200, message: "Valid user" });
      } else {
        res.status(404).json({ error: "Token not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  deconnectionFromDevices: async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ where: { email, isArchived: false } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await Token.destroy({ where: { UserId: user.id } });

      res.status(200).json({ message: "All tokens deleted successfully" });
    } catch (error) {
      console.error("Error during token deletion:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  changePasswordCRM: async (req, res) => {
    const { id, currentPassword, newPassword, confirmPassword } = req.body;

    try {
      if (!id || !currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
          error:
            "Please provide id, current password, new password, and confirm password",
        });
      }

      if (newPassword !== confirmPassword) {
        return res
          .status(422)
          .json({ error: "New password and confirm password do not match" });
      }

      const user = await User.findOne({ where: { id, isArchived: false } });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(422).json({ error: "Current password is incorrect" });
      }

      if (currentPassword === newPassword) {
        return res
          .status(422)
          .json({
            error: "New password must be different from current password",
          });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      const updateUser = await User.update(
        { password: hashedNewPassword },
        { where: { id } }
      );

      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  changePasswordCRMVerif: async (req, res) => {
    const { id, currentPassword, newPassword, confirmPassword } = req.body;

    try {
      if (!id || !currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
          error:
            "Please provide current password, new password, and confirm password",
        });
      }

      if (newPassword !== confirmPassword) {
        return res
          .status(422)
          .json({ error: "New password and confirm password do not match" });
      }

      const user = await User.findOne({ where: { id, isArchived: false } });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(422).json({ error: "Current password is incorrect" });
      }

      if (currentPassword === newPassword) {
        return res
          .status(422)
          .json({
            error: "New password must be different from current password",
          });
      }

      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  IdDeconnectionFromDevices: async (req, res) => {
    const { id, token } = req.body;
    try {
      await Token.destroy({
        where: {
          UserId: id,
          token: { [Sequelize.Op.ne]: token },
        },
      });

      res
        .status(200)
        .json({
          message: "All tokens except the specified one deleted successfully",
        });
    } catch (error) {
      console.error("Error during token deletion:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  updatePhoneNumber: async (req, res) => {
    const { phoneNumber, id } = req.body;
  
    if (!phoneNumber || !id) {
      return res.status(400).json({ message: "User ID and phone number are required" });
    }
  
    try {
      // Check if the phone number already exists
      const existingUser = await User.findOne({ where: { phoneNumber } });
      if (existingUser && existingUser.id !== id) {
        return res.status(409).json({ message: "Phone number already exists" });
      }
  
      const result = await User.update({ phoneNumber }, { where: { id } });
  
      const updated = result[0];
  
      if (updated) {
        res.status(200).json({ message: "Phone number updated successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error during phone number update:", error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ message: "Phone number already exists" });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  },
  
  verifPassword: async (req, res) => {
    try {
      const { id, pass } = req.body;

      if (!pass) {
        return res.status(400).json({
          error: "Please provide your password",
        });
      }

      if (!id) {
        return res.status(400).json({
          error: "User id not found",
        });
      }

      const user = await User.findOne({ where: { id, isArchived: false } });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isMatch = await bcrypt.compare(pass, user.password);

      if (isMatch) {
        return res.status(200).json({ message: "Password is correct" });
      } else {
        return res.status(422).json({ error: "Password is incorrect" });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  idDeconnectionFromAllDevices: async (req, res) => {
    const { id } = req.body;

    try {
      const user = await User.findOne({ where: { id } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await Token.destroy({ where: { UserId: user.id } });

      res.status(200).json({ message: "All tokens deleted successfully" });
    } catch (error) {
      console.error("Error during token deletion:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  deleteAccount: async (req, res) => {
    const { id } = req.body;
  
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }
  
    try {
      const user = await User.findOne({ where: { id } });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const [updated] = await User.update(
        { isArchived: true },
        { where: { id } }
      );
  
      if (!updated) {
        return res.status(500).json({ message: "Failed to archive user" });
      }
  
      const deletedTokens = await Token.destroy({ where: { UserId: id } });
  
      if (deletedTokens === 0) {
        return res.status(200).json({ message: "User archived, but no tokens were found to delete" })
      }
  
      res.status(200).json({ message: "User archived and tokens deleted successfully" });
  
    } catch (error) {
      console.error("Error during user deletion:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  
};
