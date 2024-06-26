const { type } = require("os");

module.exports = (DataTypes, connection) => {
  const BookedPeriods = connection.define("BookedPeriods", {
    CarId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    BookedPeriods: {
      type: DataTypes.DATEONLY,
      unique: false
    },
    rentalTime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    returnTime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    UserId: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  return BookedPeriods;
};
