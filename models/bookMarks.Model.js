module.exports = (DataTypes, connection) => {
    const BookMark = connection.define("booMmark", {
        UserId : {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        CarId:{
            type : DataTypes.INTEGER,
            allowNull: false,
        }
    });
    return BookMark;
};