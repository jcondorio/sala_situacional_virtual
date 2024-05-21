// models/provicionalModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Provicional = sequelize.define('Provicional', {
  subregion: DataTypes.STRING,
  red: DataTypes.STRING,
  microred: DataTypes.STRING,
  estado: DataTypes.STRING,
  N_RED: DataTypes.STRING,
  N_Micro_RED: DataTypes.STRING,
  N_EESS: DataTypes.STRING,
  CATEGORIA: DataTypes.STRING,
  Dpto: DataTypes.STRING,
  Prov: DataTypes.STRING,
  Distrit: DataTypes.STRING,
  UBIGEO_RN: DataTypes.STRING,
  COD_EST: {
    type: DataTypes.STRING,
    primaryKey: true
  },
}, {
  tableName: 'provicional',
  timestamps: false
});

module.exports = Provicional;
