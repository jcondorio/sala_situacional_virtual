const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');
const Diresa = require('./diresaModel.js');
const Red = require('./redModel.js');

const Microred = sequelize.define('Microred', {
    registroId: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    codigo: DataTypes.STRING,
    nombre: DataTypes.STRING,
    estado: DataTypes.INTEGER,
}, {
    tableName: 'microred',
    timestamps: false
});
Diresa.belongsTo(Diresa, { foreignKey: 'subregion' });
Red.belongsTo(Red, {foreignKey:'red'});

module.exports = Microred;