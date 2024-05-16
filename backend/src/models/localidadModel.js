const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');
const Departamento = require("./departamentoModel.js");
const Provincia = require("./provinciaModel.js");
const Distrito = require('./distritoModel.js');

const Localidad = sequelize.define('Localidad', {
    codloc: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    cod_inei: DataTypes.STRING,
    nombre: DataTypes.STRING,
    clasif: DataTypes.STRING,
    x: DataTypes.STRING,
    y: DataTypes.STRING,
    nombre: DataTypes.STRING,
    coddep: DataTypes.STRING,
    codprov: DataTypes.STRING,
    ubigeo: DataTypes.STRING
}, {
    tableName: 'localidad',
    timestamps: false
});
Localidad.belongsTo(Departamento, { foreignKey: 'coddep' });
Localidad.belongsTo(Provincia, { foreignKey: 'codprov' });
Localidad.belongsTo(Distrito,{foreignKey:'ubigeo'})

module.exports = Localidad;
