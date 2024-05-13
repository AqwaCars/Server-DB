module.exports = (DataTypes,connection)=>{
    const Media= connection.define('Media',{
    media:{
        type:DataTypes.STRING,
        allowNull:true
    }
    
    });
    return Media
    }