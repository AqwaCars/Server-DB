module.exports = (DataTypes,connection) => {
  const History = connection.define("History", {});
  return History;
};
