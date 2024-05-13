module.exports = (DataTypes, connection) => {
  const Agency = connection.define("Agency", {
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verificationStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    backgroundImage: {
      type: DataTypes.STRING,
    defaultValue: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzjW45_1AHC87TBlvxPTIhbbnx6N0oA2iUkA&usqp=CAU",
    }
  });
  return Agency;
};
