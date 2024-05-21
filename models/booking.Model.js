module.exports = (DataTypes, connection) => {
  const Booking = connection.define("Booking", {
    destination: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    CarId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    acceptation: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return Booking;
};
