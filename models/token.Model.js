module.exports = (DataTypes, connection) => {
    const Token = connection.define("Token", {
      token: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    });
    return Token;
  };
  