const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');
const Departamento = require("./departamentoModel.js");

const Diresa = sequelize.define('Diresa', {
    codigo: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    region: DataTypes.STRING,
    nombre: DataTypes.STRING,
    departamento: DataTypes.STRING 
}, {
    tableName: 'diresa',
    timestamps: false
});

Diresa.belongsTo(Departamento, { foreignKey: 'departamento' });

module.exports = Diresa;
