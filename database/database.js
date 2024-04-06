const Sequelize = require('sequelize');
const connection = new Sequelize('guiapress','root','123456',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00' // horário do Brasil
})

module.exports = connection