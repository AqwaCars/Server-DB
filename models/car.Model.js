module.exports = (DataTypes, connection) => {
  const Car = connection.define("Car", {
    model: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    media: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Year: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    typeOfFuel: {
      type: DataTypes.ENUM("Gasoline", "Diesel", "Electric"),
      allowNull: true,
    },
    acceptation: {
      type: DataTypes.ENUM("rejected", "accepted", "pending"),
      allowNull: true,
      defaultValue: "pending",
    },
    Category: {
      type: DataTypes.ENUM("Economic Class", "Luxery Car", "Sports"),
    },
    Type: {
      type: DataTypes.ENUM("Automatic", "Manual"),
    },
    peopleCount: {
      type: DataTypes.INTEGER
    },
    DoorNumber: {
      type: DataTypes.INTEGER
    },
    Capacity: {
      type: DataTypes.INTEGER
    }
  });
  return Car;
};
