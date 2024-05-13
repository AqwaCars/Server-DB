module.exports = (DataTypes, connection) => {
  const RentelRequest = connection.define("RentelRequest", {
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
  return RentelRequest;
};
