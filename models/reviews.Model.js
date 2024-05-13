module.exports = (DataTypes, connection) => {
  const Review = connection.define("review", {
    rating: {
      type: DataTypes.ENUM("1", "2", "3", "4", "5"),
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    senderType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Review;
};
