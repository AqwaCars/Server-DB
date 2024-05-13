// Assuming you are using Sequelize for defining your model

module.exports = (DataTypes, connection) => {
  const Messages = connection.define('messages', {
    message: {
      type: DataTypes.STRING, // Change the type to STRING to accommodate text messages
      allowNull: true, // Allow NULL for text messages
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
    },
    fileData: {
      type: DataTypes.BLOB('long'), // Use BLOB type for binary data
      allowNull: true, // Allow NULL for non-file messages
    },
  });

  return Messages;
};
