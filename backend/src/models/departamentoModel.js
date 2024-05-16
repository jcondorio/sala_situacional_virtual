const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Departamento = sequelize.define('Departamento', {
    ubigeo: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    nombre: DataTypes.STRING
}, {
    tableName: 'departamento',
    timestamps: false
});

module.exports = Departamento;