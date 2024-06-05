module.exports = (DataTypes, connection) => {
  const validator = require("validator");
  const bcrypt = require("bcrypt");
  const saltRounds = bcrypt.genSaltSync(10);  
  const User = connection.define("User", {
    userName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    carsRented: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   validator: function (v) {
      //     return validator.isStrongPassword(v, {
      //       minLength: 8,
      //       minLowercase: 1,
      //       minUppercase: 1,
      //       minNumbers: 1,
      //       minSymbols: 1,
      //     });
      //   },
      //   message:
      //     "Password must contain at least one special character, one lowercase letter, one uppercase letter, one number, and be at least 8 characters long",
      // },
      allowNull: true,
      defaultValue:"1234"
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      // validate: {
      //   validator: validator.isEmail,
      //   message: "Email is not valid",
      // },
    },
    type:{
      type:DataTypes.ENUM("user","company"),
      allowNull: true,
      defaultValue: "user",
    },
    RNE: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:"",
    },
    dateOfBirth: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue:false,
      allowNull: true
    },
    isArchived: {
      type: DataTypes.BOOLEAN,
      defaultValue:false,
      allowNull: true
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue:false,
      allowNull: true
    },
    selfie: {
      type: DataTypes.STRING,
      defaultValue:
        "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg&uid=R68467429&ga=GA1.1.970682958.1696962532&semt=ais",
      allowNull: true,
    },
    drivingLicenseFront: {
      type: DataTypes.STRING,
      defaultValue:
        "https://as1.ftcdn.net/v2/jpg/04/60/01/36/1000_F_460013622_6xF8uN6ubMvLx0tAJECBHfKPoNOR5cRa.jpg",
      allowNull: true,
    },
    drivingLicenseBack: {
      type: DataTypes.STRING,
      defaultValue:
        "https://as1.ftcdn.net/v2/jpg/04/60/01/36/1000_F_460013622_6xF8uN6ubMvLx0tAJECBHfKPoNOR5cRa.jpg",
      allowNull: true,
    },
    cardIdFront: {
      type: DataTypes.STRING,
      defaultValue:
        "https://as1.ftcdn.net/v2/jpg/04/60/01/36/1000_F_460013622_6xF8uN6ubMvLx0tAJECBHfKPoNOR5cRa.jpg",
      allowNull: true,
    },
    cardIdBack: {
      type: DataTypes.STRING,
      defaultValue:
        "https://as1.ftcdn.net/v2/jpg/04/60/01/36/1000_F_460013622_6xF8uN6ubMvLx0tAJECBHfKPoNOR5cRa.jpg",
      allowNull: true,
    },
    passport: {
      type: DataTypes.STRING,
      defaultValue:
        "https://as1.ftcdn.net/v2/jpg/04/60/01/36/1000_F_460013622_6xF8uN6ubMvLx0tAJECBHfKPoNOR5cRa.jpg",
      allowNull: true,

    },
    stateBlocked: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verificationOTP: {
      type: DataTypes.STRING,
      allowNull: true,
      },
    forgetPasswordOTP: {
      type: DataTypes.STRING,
      allowNull: true,
      },
      Rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: null
      },
      numberOfCustomrs:{
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
      }
  });
  User.beforeCreate((User, options) => {
    User.password = bcrypt.hashSync(User.password, saltRounds);
  });
  return User;
};
