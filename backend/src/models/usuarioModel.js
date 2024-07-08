const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Usuario = sequelize.define('Usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario: DataTypes.STRING,
  psw: DataTypes.STRING
}, {
  tableName: 'usuario',
  timestamps: false
});

module.exports = Usuario;