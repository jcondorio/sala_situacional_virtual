const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');
const Diresa = require('./diresaModel.js');
const Red = require('./redModel.js');
const Microred = require('./microredModel.js');
const Distrito = require('./distritoModel.js');
const Provicional = require('./provicionalModel.js');

const Iras = sequelize.define('Iras', {
    id_iras: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ID: DataTypes.INTEGER,
    ANO: DataTypes.INTEGER,
    SEMANA: DataTypes.INTEGER,
    E_SALUD: DataTypes.STRING,
    IRA_M2: DataTypes.INTEGER,
    IRA_2_11: DataTypes.INTEGER,
    IRA_1_4A: DataTypes.INTEGER,
    NEU_2_11: DataTypes.INTEGER,
    NEU_1_4A: DataTypes.INTEGER,
    NEU_5_9A: DataTypes.INTEGER,
    NEU_10_19: DataTypes.INTEGER,
    NEU_20_59: DataTypes.INTEGER,
    NEU_60A: DataTypes.INTEGER,
    HOS_M2: DataTypes.INTEGER,
    HOS_2_11: DataTypes.INTEGER,
    HOS_1_4A: DataTypes.INTEGER,
    HOS_5_9A: DataTypes.INTEGER,
    HOS_10_19: DataTypes.INTEGER,
    HOS_20_59: DataTypes.INTEGER,
    HOS_60A: DataTypes.INTEGER,
    NGR_M2: DataTypes.INTEGER,
    NGR_2_11: DataTypes.INTEGER,
    NGR_1_4A: DataTypes.INTEGER,
    NGR_5_9A: DataTypes.INTEGER,
    NGR_60A: DataTypes.INTEGER,
    DIH_M2: DataTypes.INTEGER,
    DIH_2_11:DataTypes.INTEGER,
    DIH_1_4A:DataTypes.INTEGER,
    DIH_5_9A:DataTypes.INTEGER,
    DIH_10_19:DataTypes.INTEGER,
    DIH_20_59:DataTypes.INTEGER,
    DIH_60A:DataTypes.INTEGER,
    DEH_M2:DataTypes.INTEGER,
    DEH_2_11:DataTypes.INTEGER,
    DEH_1_4A:DataTypes.INTEGER,
    DEH_5_9A:DataTypes.INTEGER,
    DEH_10_19:DataTypes.INTEGER,
    DEH_20_59:DataTypes.INTEGER,
    DEH_60A:DataTypes.INTEGER,
    SOB_2A:DataTypes.INTEGER,
    SOB_5_9A:DataTypes.INTEGER,
    SOB_10_19A:DataTypes.INTEGER,
    SOB_20_59A:DataTypes.INTEGER,
    FECHA_ING:DataTypes.DATE,
    ETNIAPROC:DataTypes.INTEGER,
    ETNIAS:DataTypes.INTEGER,
    PROCEDE:DataTypes.INTEGER,
    OTROPROC:DataTypes.INTEGER,
    SUB_REG_NT:DataTypes.INTEGER,
    RED:DataTypes.INTEGER,
    MICRORED:DataTypes.INTEGER,
    UBIGEO:DataTypes.INTEGER,

}, {
    tableName: 'iras',
    timestamps: false
});
Iras.belongsTo(Provicional, { foreignKey: 'E_SALUD', targetKey: 'COD_EST', as: 'provicional' });

module.exports = Iras;
