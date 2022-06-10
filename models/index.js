const config = require('config');
const Sequelize = require('sequelize')
const dbConfig = config.get('dbConfig');

const models=['User'];

const db={};

console.log("Connect to DB",dbConfig.HOST);
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
  
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  });
  

db.sequelize = sequelize;
db.Sequelize = Sequelize;
 models.forEach(function(model) {
    db[model]=require('./' + model)(sequelize, Sequelize);
 });


module.exports= db;
