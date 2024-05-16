const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');
const Diresa = require('./diresaModel.js');
const Red = require('./redModel.js');
const Microred = require('./microredModel.js');
const Distrito = require('./distritoModel.js');

const Establecimiento = sequelize.define('Establecimiento', {
    cod_est: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    registroId: DataTypes.STRING,
    raz_soc: DataTypes.STRING,
    notifica: DataTypes.STRING,
    tipo: DataTypes.STRING,
    nivel: DataTypes.STRING,
    renaes: DataTypes.STRING,
    nombre: DataTypes.STRING,
    categoria: DataTypes.STRING,
    estado: DataTypes.INTEGER,
    subregion: DataTypes.INTEGER,
    red: DataTypes.INTEGER,
    microred: DataTypes.INTEGER,
    ubigeo_rn: DataTypes.STRING,
}, {
    tableName: 'establecimiento',
    timestamps: false
});
Diresa.belongsTo(Diresa, { foreignKey: 'subregion' });
Red.belongsTo(Red, { foreignKey: 'red' });
Microred.belongsTo(Microred, { foreignKey: 'microred' });
Distrito.belongsTo(Distrito, { foreignKey: 'ubigeo_rn' });

module.exports = Establecimiento;