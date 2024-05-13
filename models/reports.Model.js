module.exports = (DataTypes, connection) => {
  const Report = connection.define("report", {
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Date: {
      type: DataTypes.DATE,
      
    }, 
    sender: {
      type: DataTypes.STRING
    },
    Reported:{
      type: DataTypes.STRING
    }
  });
  return Report;
};
