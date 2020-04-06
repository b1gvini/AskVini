const sequelize = require('sequelize')
const connection = new sequelize('askvinicius','root','root',{
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection