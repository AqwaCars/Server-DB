module.exports = (DataTypes, connection) => {
  const Review = connection.define("review", {
    ratingCar: {
      type: DataTypes.FLOAT,
      allowNull:true,
      defaultValue:null
    },
    ratingAgency: {
      type: DataTypes.FLOAT,
      allowNull:true,
      defaultValue:null
    }
  });
  return Review;
};
