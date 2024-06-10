const { db } = require("../models/index");
const Admin = db.Admin;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { where } = require("sequelize");
require("dotenv").config();
// Controller methods for Admin
module.exports = {
  bringAdminData: async (req, res, next) => {
    try {
      const admin = await Admin.findAll({});
      res.json(Admin);
    } catch (error) {
      next(error);
    }
  },
  getAgencyCars: async (req, res, next) => {
    try {
      const data = await db.Car.findAll({
        where: {
          UserId: req.params.id
        },

        order: [['createdAt', 'DESC']] // Add this line to sort by createdAt in descending order

      });
      if (data) {
        res.json(data);
      }
    } catch (error) {
      next(error);
    }
  },
  getAgencyReviews: async (req, res, next) => {
    try {
      const data = await db.Review.findAll({
        where: {
          UserId: req.params.id
        },
        include: [
          {
            model: db.Booking,
            as:"Booking",
              include: [
                {
                  model: db.User,
                  as:"User",
                  
                },
                {
                  model:db.Car,
                  as:"Car"
                }
              ],
            
          },
          {
            model:db.User,
            as:"User"
          }
        ],
        // include:[{
        //   model:db.User,
        //     as:"User"
        // }],
        order: [['createdAt', 'DESC']] // This line sorts the results by createdAt in descending order
      });

      if (data) {
        res.json(data);
      }
    } catch (error) {
      next(error);
    }
  },
  SignUpAdmin: async (req, res, next) => {
    const NameCheck = await Admin.findAll({
      where: {
        Name: req.body.Name,
      },
    });
    const emailCheck = await Admin.findAll({
      where: {
        email: req.body.email,
      },
    });
    if (NameCheck[0] || emailCheck[0]) {
      if (NameCheck[0]) {
        return res.status(403).send({
          status: "Blocked",
          message: "This AdminName Already Exists",
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
      const admin = await Admin.create(req.body);
      res.status(201).send({
        status: "success",
        message: "Admin added successfully!!!",
        data: admin,
      });
    }
    try {
    } catch (err) {
      next(err);
    }
  },
  // checks if a Admin exists using email
  emailLogin: async (req, res, next) => {
    try {
      console.log(req.body);
      const admin = await Admin.findOne({ where: { email: req.body.email } });
      if (!admin) {
        return res.status(404).json("Admin does not exist");
      }
      // if (!admin.dataValues) {
      //   return res.status(404).json("Admin does not exist");
      // }
      console.log("bcrypt comparing", "password:", req.body.password, "admin password:", admin.dataValues.password);
      if (!(await bcrypt.compare(req.body.password, admin.dataValues.password))
      ) {
        return res.status(401).json("wrong password");
      }
      console.log("respone for login", await bcrypt.compare(req.body.password, admin.dataValues.password))
      const token = await jwt.sign(admin.dataValues, process.env.JWT_SECRET_KEY);
      console.log(token);
      res.status(200).send(token);
    } catch (err) {
      next(err)
    }
  },
  // gets Admin token from the front to verify it and sends it back to front
  handleToken: async (req, res, next) => {
    try {
      console.log("lllllllllllllllllllllllllll", req.body);
      const response = jwt.verify(req.body.token, process.env.JWT_SECRET_KEY);
      // delete response.password;
      res.status(200).json(response);
    } catch (err) {
      next(err)
    }
  },

  // Get Admin by email
  getAdminByEmail: async (req, res, next) => {
    try {
      const Admin = await Admin.findOne({ where: { email: req.params.email } });
      if (!Admin) {
        return res.status(404).json("Admin does not exist");
      }
      res.status(200).send("Admin exists");
    } catch (err) {
      next(err);
    }
  },

  // Get Admin by phone number
  getAdminByPhoneNumber: async (req, res, next) => {
    try {
      const Admin = await Admin.findOne({
        where: { phoneNumber: req.params.phoneNumber },
      });
      if (!Admin) {
        return res.status(404).json("Admin does not exist");
      }
      res.status(200).send("Admin exists");
    } catch (err) {
      next(err);
    }
  },

  // Get a specific Admin by ID
  getAdminById: async (req, res, next) => {
    const AdminId = req.params.id;
    try {
      const Admin = await Admin.findByPk(AdminId);
      if (Admin) {
        res.json(Admin);
      } else {
        res.status(404).json({ message: "Admin not found" });
      }
    } catch (err) {
      next(err);
    }
  },

  // Update a Admin by ID
  updateAdmin: async (req, res, next) => {
    const AdminId = req.params.id;
    try {
      const [updated] = await Admin.update(req.body, {
        where: { id: AdminId },
      });
      if (updated) {
        const updatedAdmin = await Admin.findByPk(AdminId);
        res.json(updatedAdmin);
      } else {
        res.status(404).json({ message: "Admin not found" });
      }
    } catch (err) {
      next(err);
    }
  },

  // Delete a Admin by ID
  deleteAdmin: async (req, res) => {
    const AdminId = req.params.id;
    try {
      const deleted = await Admin.destroy({
        where: { id: AdminId },
      });
      if (deleted) {
        res.json({ message: "Admin deleted" });
      } else {
        res.status(404).json({ message: "Admin not found" });
      }
    } catch (err) {
      res.json(err);
    }
  },
  getAllUsers: async (req, res, next) => {
    try {
      const allUsers = await db.User.findAll();
      res.send(allUsers);
    } catch (error) {
      next(error);
    }
  },
  getAllCompanies: async (req, res, next) => {
    try {
      const allCompanies = await db.User.findAll({
        where: {
          type: "company"
        }
      });
      res.send(allCompanies);
    } catch (error) {
      next(error);
    }
  },
  getLimitedCompanies: async (req, res, next) => {
    try {
      const allCompanies = await db.User.findAll({
        where: {
          type: "company"
        },
        order: [['createdAt', 'DESC']], // Order by the 'createdAt' column in descending order
        limit: 6 // Limit the results to the latest 10 companies
      });
      res.send(allCompanies);
    } catch (error) {
      next(error);
    }
  },

  getAllCars: async (req, res, next) => {
    try {
      const allCars = await db.Car.findAll({
      });
      res.send(allCars);
    } catch (error) {
      next(error);
    }
  },

  getLimitedCars: async (req, res, next) => {
    try {
      const allCars = await db.Car.findAll({
        order: [['createdAt', 'DESC']], // Order by the 'createdAt' column in descending order
        limit: 6 // Limit the results to the latest 10 companies
      });
      res.send(allCars);
    } catch (error) {
      next(error);
    }
  },

  updateOneUserblockState: async (req, res, next) => {
    try {
      const user = await db.User.findOne({ where: { id: req.params.id } });
      if (!user.isBlocked) {
        await db.Token.destroy({
          where: {
            id: user.id
          }
        }
        )
      }
      const oneUser = await db.User.update(
        { isBlocked: !user.isBlocked },
        {
          where: {
            id: user.id,
          },
        }
      );
      res.status(200).send(oneUser);
    } catch (error) {
      next(error);
    }
  },
  updateData:async(req,res,next)=>{
    try {
      const user = await db.User.findOne({ where: { id: req.params.id } });
      if (user) {
        const oneUser = await db.User.update(req.body,{where:{
          id:user.id
        }})
        res.status(200).send(oneUser)
      }
    } catch (error) {
      next(error)
    }
  }
};
