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
    deposit: {
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
    Category: {
      type: DataTypes.ENUM("Economy", "Premium", "Compact","SUV"),
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
    },
    Rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: null
    },
    numberOfCustomrs:{
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    location : {
      type: DataTypes.STRING,
    }
  });
  return Car;
};
