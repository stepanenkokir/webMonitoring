module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
      
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING(60)
        },
        password: {
            type: Sequelize.STRING(41)
        },
        hash: {
            type: Sequelize.STRING(32)
        },
        type: {
            type: Sequelize.INTEGER
        }
    },{
        freezeTableName: true,
    });
  
    return User;
};

