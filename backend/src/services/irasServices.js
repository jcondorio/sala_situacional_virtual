const Iras = require("../models/irasModel");
const sequelize = require('sequelize'); // Asegúrate de importar Sequelize
const Provicional = require("../models/provicionalModel");
// Importa Provicional si es necesario

const getIrasSemanasServices = async () => {
    console.log("importDataServices: ");
    try {
      const result = await Iras.findAll({
        attributes: [
          'SEMANA',
          [sequelize.literal('SUM(IRA_M2 + IRA_2_11 + IRA_1_4A)'), 'cantidad_registros']
        ],
        group: ['SEMANA']
      });
        
        // Maneja el resultado de la consulta aquí
        console.log(result);
        return result;
      } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante la consulta
        console.error('Error al ejecutar la consulta:', error);
        throw error; // Puedes relanzar el error para manejarlo en otro lugar si es necesario
      }
  };

const getIrasUltimaSemanaDistrit = async () =>{
  console.log("importDataServices: ");
    try {
      const result = await Iras.findAll({
        attributes: [
          [sequelize.literal('prov.Distrit'), 'Distrit'],
          [sequelize.fn('SUM', sequelize.literal('IRA_M2 + IRA_2_11 + IRA_1_4A')), 'total_registros']
        ],
        include: [{
          model: Provicional,
          where: { COD_EST: Sequelize.col('iras.E_SALUD') }
        }],
        where: {
          SEMANA: sequelize.literal('(SELECT MAX(SEMANA) FROM iras)')
        },
        group: [sequelize.literal('prov.Distrit')]
      });
        
        // Maneja el resultado de la consulta aquí
        console.log(result);
        return result;
      } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante la consulta
        console.error('Error al ejecutar la consulta:', error);
        throw error; // Puedes relanzar el error para manejarlo en otro lugar si es necesario
      }
}
  
module.exports = {
    getIrasSemanasServices,
};
