module.exports = (DataTypes, connection) => {
  const BookedPeriods = connection.define("BookedPeriods", {
    CarId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    BookedPeriod: {
      type: DataTypes.DATEONLY,
    },
  });

  return BookedPeriods;
};
