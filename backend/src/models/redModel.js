const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');
const Diresa = require('./diresaModel.js');

const Red = sequelize.define('Red', {
    registroId: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    codigo: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    estado: DataTypes.INTEGER,
    subregion: DataTypes.INTEGER,
}, {
    tableName: 'red',
    timestamps: false
});
Red.belongsTo(Diresa, { foreignKey: 'subregion' });

module.exports = Red;