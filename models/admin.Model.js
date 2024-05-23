module.exports = (DataTypes, connection) => {
    const bcrypt = require("bcrypt");
    const saltRounds = bcrypt.genSaltSync(10);
    const Admin = connection.define('Admin', {
        Name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true
        },
        clearance: {
            type: DataTypes.ENUM,
            values: ['Level1', 'Level2', 'Level3'],
            allowNull: false
        }
    })    
    Admin.beforeCreate((Admin, options) => {
        Admin.password = bcrypt.hashSync(Admin.password, saltRounds);
    });
    ;
    return Admin
}
