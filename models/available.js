module.exports = (DataTypes, connection) => {
  const Availability = connection.define("Availability", {
    CarId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });

  return Availability;
};
