const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');
const Departamento = require("./departamentoModel.js");

const Provincia = sequelize.define('Provincia', {
    ubigeo: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    nombre: DataTypes.STRING,
    departamento: DataTypes.STRING 
}, {
    tableName: 'provincia',
    timestamps: false
});
Provincia.belongsTo(Departamento, { foreignKey: 'departamento' });

module.exports = Provincia;