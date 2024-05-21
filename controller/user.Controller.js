require("dotenv").config();
const { db } = require("../models/index");
const User = db.User;
const Token = db.Token;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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
          req.params.DataType === "A-Z" ?
            ['userName', 'ASC'] : req.params.DataType === "createdAt" ?
              ['createdAt', 'ASC'] : req.params.DataType === "carsRented" ?
                ["carsRented", 'ASC'] : null
        ]
      })
      list ?
        res.json(list) : res.json([])
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
  // SignUpUser: async (req, res, next) => {
  //   const NameCheck = await db.User.findAll({
  //     where: {
  //       userName: req.body.userName,
  //     },
  //   });
  //   const emailCheck = await db.User.findAll({
  //     where: {
  //       email: req.body.email,
  //     },
  //   });
  //   if (NameCheck[0] || emailCheck[0]) {
  //     if (NameCheck[0]) {
  //       return res.status(403).send({
  //         status: "Blocked",
  //         message: "This UserName Already Exists",
  //         found: NameCheck,
  //       });
  //     }
  //     if (emailCheck[0]) {
  //       return res.status(403).send({
  //         status: "Blocked",
  //         message: "This Email Already Exists",
  //         found: emailCheck,
  //       });
  //     }
  //   } else {
  //     const User = await db.User.create(req.body);
  //     res.status(201).send({
  //       status: "success",
  //       message: "user added successfully!!!",
  //       data: User,
  //     });
  //   }
  //   try {
  //   } catch (err) {
  //     next(err);
  //   }
  // },
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
  // checks if a user exists using email

  // SignUpUser: async (req, res, next) => {
  //   try {
  //   const emailCheck = await db.User.findAll({
  //     where: {
  //       email: req.body.email,
  //     },
  //   });
  //   if (emailCheck[0]) {

  //       return res.status(403).send({
  //         status: "Blocked",
  //         message: "This Email Already Exists",
  //         found: emailCheck,
  //       });

  //   } else {
  //     const User = await db.User.create(req.body);
  //     res.status(201).send({
  //       status: "success",
  //       message: "user added successfully!!!",
  //       data: User,
  //     });
  //   }
  //   } catch (err) {
  //     next(err);
  //   }
  // },
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
      !passport
    ) {
      return res.status(422).json({ error: "fill all the details" });
    }
    try {
      console.log("Before finding user");
      const findUser = await User.findOne({ where: { email: email } });
      const findUserByPhone = await User.findOne({
        where: { phoneNumber: phoneNumber },
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
          passport,
        });
        console.log(finalUser);
        res.status(201).json(finalUser);
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Internal server error", details: error.message });
    }
  },
  // emailLogin: async (req, res) => {
  //   try {
  //     const user = await User.findOne({ where: { email: req.body.email } });
  //     if (!user) {
  //       return res.status(404).json("user does not exist");
  //     }
  //     if (!(await bcrypt.compare(req.body.password, user.password))) {
  //       return res.status(401).json("wrong password");
  //     }
  //     const token = jwt.sign(user.dataValues, process.env.JWT_SECRET_KEY);
  //     res.send(token);
  //   } catch (err) {
  //     res.status(500).send(err);
  //   }
  // },

  // checks if a user exists using phone number
  emailLogin: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(422)
        .json({ error: "Please provide email and password" });
    }

    try {
      const userValid = await User.findOne({ where: { email } });

      if (!userValid) {
        return res.status(404).json({ error: "User not found" });
      }
      const isMatch = await bcrypt.compare(password, userValid.password);
      if ((isMatch && userValid.isBlocked) || userValid.isArchived) {
        return res.status(403).json({
          error: "Account is blocked or archived",
        });
      }
      if (isMatch && !userValid.isVerified) {
        return res.status(403).json({
          error: "Account not verified. Please verify your email address",
        });
      }
      if (!isMatch) {
        return res.status(422).json({ error: "Invalid email or password" });
      }

      // const token = jwt.sign(userValid.id, process.env.JWT_SECRET_KEY);
      if (isMatch && userValid.isVerified && !userValid.isBlocked && !userValid.isArchived) {
     
        const token = await jwt.sign({ id: userValid.id }, process.env.JWT_SECRET_KEY);
        
        const result = {
          id:userValid.id,
          email:userValid.email,
          token,
        };
        
        const AddToken = await db.Token.create({token:token,UserId:userValid.id});
        res.status(200).json({ status: 200, result });
        };
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  accountVerification: async (req, res) => {
    const { email, otpCode } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
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
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const updateUser = await User.update(
        { verificationOTP: code },
        { where: { email } }
      );
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Account Verification Code",
        text: `Your Account verification code is: ${code}`,
      };

      await transporter.sendMail(mailOptions);

      console.log("Email sent successfully");
      return res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
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
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const updateUser = await User.update(
        { forgetPasswordOTP: code },
        { where: { email } }
      );
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset Password Code",
        text: `Your rest password code is: ${code}`,
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
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Welcome To Aqua Cars!",
        text: `Welcome ${user.userName} to Aqua Cars`,
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
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.forgetPasswordOTP !== otpCode) {
        return res.status(400).json({ error: "Incorrect OTP code" });
      }
      if(user.forgetPasswordOTP === otpCode){

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
        return res
          .status(400)
          .json({
            error: "Please provide email, new password, and confirm password",
          });
      }
  
      if (newPassword !== confirmPassword) {
        return res
          .status(422)
          .json({ error: "New password and confirm password do not match" });
      }
  
      const user = await User.findOne({ where: { email } });
  
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
  deconnection: async (req, res) => {
    const { token } = req.body;
  
    try {
      const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      // console.log(verifyToken.id,"This is token");
  
      const tokens = await Token.findAll({ where: { UserId: verifyToken.id, token: token } });
  
      if (tokens.length > 0) {
        await Token.destroy({ where: { UserId: verifyToken.id, token: token } });
        res.status(200).json({ status: 200, message: 'Token successfully deleted' });
      } else {
        res.status(404).json({ error: 'Token not found' });
      }
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        res.status(403).json({ error: 'Invalid token' });
      } else {
        console.error("Error during deconnection:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
  validatorUser: async (req, res) => {
    const { token } = req.body
    try {
      const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log(verifyToken.id,"This is token");

      const tokens = await Token.findAll({ where: { UserId: verifyToken.id, token: token } });
      if (tokens.length > 0) {
        res.status(200).json({ status: 200, message: 'Valid user' });
      } else {
        res.status(404).json({ error: 'Token not found' });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

};
