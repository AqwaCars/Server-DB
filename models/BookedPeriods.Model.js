module.exports = (DataTypes, connection) => {
  const BookedPeriods = connection.define("BookedPeriods", {
    CarId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    BookedPeriods: {
      type: DataTypes.DATEONLY,
      unique:true
    },
    UserId:{
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  return BookedPeriods;
};
