const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');
const Departamento = require("./departamentoModel.js");
const Provincia = require("./provinciaModel.js");
const Diresa = require('./diresaModel.js');

const Distrito = sequelize.define('Distrito', {
    ubigeo: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    nombre: DataTypes.STRING,
    departamento: DataTypes.STRING,
    provincia: DataTypes.STRING,
    diresa: DataTypes.STRING,
}, {
    tableName: 'distrito',
    timestamps: false
});
Departamento.belongsTo(Departamento, { foreignKey: 'departamento' });
Provincia.belongsTo(Provincia, { foreignKey: 'provincia' });
Diresa.belongsTo(Diresa,{foreignKey:'diresa'})

module.exports = Distrito;
