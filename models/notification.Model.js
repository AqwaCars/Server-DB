module.exports = (DataTypes, connection) => {
  const Notifcation = connection.define("Notification", {
    notification: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Notifcation;
};
