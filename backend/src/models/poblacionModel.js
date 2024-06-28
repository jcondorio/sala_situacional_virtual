// models/provicionalModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Poblacion = sequelize.define('poblacion', {
    anoubigeo:{
        type: DataTypes.NUMBER,
        primaryKey: true
      },
    ano: DataTypes.NUMBER,
    ubigeo: DataTypes.NUMBER,
    frontera: DataTypes.STRING,
    friaje: DataTypes.NUMBER,
    indigena: DataTypes.NUMBER,
    vraem: DataTypes.NUMBER,
    ubiprov: DataTypes.NUMBER,
    cod_disa: DataTypes.NUMBER,
    disa15: DataTypes.NUMBER,
    distrito: DataTypes.STRING,
    provincia: DataTypes.STRING,
    departam: DataTypes.STRING,
    reg_geogra: DataTypes.STRING,
    reg_natu: DataTypes.STRING,
    disa: DataTypes.STRING,
    e0: DataTypes.NUMBER,
    e1_4: DataTypes.NUMBER,
    men_5: DataTypes.NUMBER,
    e5_mas: DataTypes.NUMBER,
    men_15: DataTypes.NUMBER,
    nacidos: DataTypes.NUMBER,
    men_29d: DataTypes.NUMBER,
    gestantes: DataTypes.NUMBER,
    mef: DataTypes.NUMBER,
    pobtot: DataTypes.NUMBER,
    ambito: DataTypes.STRING,
    qpobreza: DataTypes.STRING,
    condpobrez: DataTypes.STRING,
    priorizado: DataTypes.STRING,
    ninos: DataTypes.STRING,
    adolescente: DataTypes.STRING,
    joven: DataTypes.STRING,
    adulto: DataTypes.STRING,
    adulto_mayor: DataTypes.STRING
}, {
    tableName: 'poblacion',
    timestamps: false
});								

module.exports = Poblacion;
