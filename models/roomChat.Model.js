module.exports = ( DataTypes, connection) => {
  const RoomChat = connection.define("room", {
    user2:{
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });
  return RoomChat;
};
