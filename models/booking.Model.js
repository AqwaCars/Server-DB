module.exports = (DataTypes, connection) => {
  const Booking = connection.define("Booking", {
    from: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    to: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    acceptation: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
    companyName:{
      type: DataTypes.STRING,
      allowNull:true
    },
    name:{
      type: DataTypes.STRING,
      allowNull:true
    },
    Email:{
      type: DataTypes.STRING,
      allowNull:true
    },
    phoneNumber:{
      type: DataTypes.STRING,
      allowNull:true
    },
    address:{
      type: DataTypes.STRING,
      allowNull:true
    },
    postalCode:{
      type: DataTypes.STRING,
      allowNull:true
    },
    city:{
      type: DataTypes.STRING,
      allowNull:true
    },
    flightNumber:{
      type: DataTypes.STRING,
      allowNull:true
    },
    rated:{
      type: DataTypes.BOOLEAN,
      defaultValue:false
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rating:{
      type: DataTypes.FLOAT,
      allowNull:true,
      defaultValue:null
    },
    ratingTry:{
      type: DataTypes.INTEGER,
      allowNull:true,
      defaultValue:0
    }
  });
  return Booking;
};
