module.exports = (DataTypes, connection) => {
  const Request = connection.define("request", {
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deposit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transportation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    agencyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Request;
};
