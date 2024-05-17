const Iras = require("../models/irasModel");
const sequelize = require('sequelize'); // Asegúrate de importar Sequelize
const Provicional = require("../models/provicionalModel");
const { Op, fn, col, literal } = require('sequelize');
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

const getIrasUltimaSemanaDistrit = async () => {
  console.log("importDataServices: ");
  try {
    const result = await Iras.findAll({
      attributes: [
        [col('provicional.Dpto'), 'Dpto'],
        [col('provicional.Prov'), 'Prov'],
        [col('provicional.Distrit'), 'Distrit'],
        [fn('SUM', literal('IRA_M2 + IRA_2_11 + IRA_1_4A')), 'total_registros']
      ],
      include: [
        {
          model: Provicional,
          as: 'provicional',
          attributes: []
        }
      ],
      where: {
        SEMANA: {
          [Op.eq]: literal('(SELECT MAX(`SEMANA`) FROM `iras`)')
        }
      },
      group: ['provicional.Dpto', 'provicional.Prov', 'provicional.Distrit']
    });

    console.log(result);
    return result;
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir durante la consulta
    console.error('Error al ejecutar la consulta:', error);
    throw error; // Puedes relanzar el error para manejarlo en otro lugar si es necesario
  }
};
const getTotalCasosIrasAnualService = async () => {
  console.log("getTotalCasosIrasAnualService")
  try {
    const result = await Iras.findOne({
      attributes: [
        [
          sequelize.fn('SUM', sequelize.literal('IRA_M2 + IRA_2_11 + IRA_1_4A')),
          'total_registros'
        ]
      ],
      include: [
        {
          model: Provicional,
          as: 'provicional',
          attributes: []
        }
      ],
      group: ['provicional.Dpto']
    });
    return result;
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir durante la consulta
    console.error('Error al ejecutar la consulta:', error);
    throw error; // Puedes relanzar el error para manejarlo en otro lugar si es necesario
  }
};


const getTotalCasosIrasUltimaSemana = async () => {
  console.log("getTotalCasosIrasUltimaSemana")

  try {
    const result = await Iras.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.literal('IRA_M2 + IRA_2_11 + IRA_1_4A')), 'total_casos']
      ],
      include: [
        {
          model: Provicional,
          as: 'provicional',
          attributes: []
        }
      ],
      where: {
        SEMANA: {
          [Op.eq]: literal('(SELECT MAX(`SEMANA`) FROM `iras`)')
        }
      },
      group: ['provicional.Dpto']
    });
    return result;
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir durante la consulta
    console.error('Error al ejecutar la consulta:', error);
    throw error; // Puedes relanzar el error para manejarlo en otro lugar si es necesario
  }
};

const getTotalDistritosCasosUltimaSemana = async () => {
  try {
    const maxWeekSubquery = `(SELECT MAX(i.SEMANA) FROM iras AS i)`;

    const result = await Iras.count({
      distinct: true,
      col: 'provicional.Distrit',
      include: [
        {
          model: Provicional,
          as: 'provicional',
          attributes: []
        }
      ],
      where: {
        SEMANA: literal(`(${maxWeekSubquery})`),
        [Op.and]: [
          literal('(IRA_M2 + IRA_2_11 + IRA_1_4A) > 0')
        ]
      }
    });

    console.log(result);
    return result;
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir durante la consulta
    console.error('Error al ejecutar la consulta:', error);
    throw error; // Puedes relanzar el error para manejarlo en otro lugar si es necesario
  }
};

const getTotalEstrablecimientosCasosUltimaSemana = async () => {
  try {
    const maxWeekSubquery = `(SELECT MAX(i.SEMANA) FROM iras AS i)`;

    const result = await Iras.count({
      distinct: true,
      col: 'provicional.N_EESS',
      include: [
        {
          model: Provicional,
          as: 'provicional',
          attributes: []
        }
      ],
      where: {
        SEMANA: literal(`(${maxWeekSubquery})`),
        [Op.and]: [
          literal('(IRA_M2 + IRA_2_11 + IRA_1_4A) > 0')
        ]
      }
    });

    console.log(result);
    return result;
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir durante la consulta
    console.error('Error al ejecutar la consulta:', error);
    throw error; // Puedes relanzar el error para manejarlo en otro lugar si es necesario
  }
};

module.exports = {
  getIrasSemanasServices,
  getIrasUltimaSemanaDistrit,
  getTotalCasosIrasAnualService,
  getTotalCasosIrasUltimaSemana,
  getTotalDistritosCasosUltimaSemana,
  getTotalEstrablecimientosCasosUltimaSemana,
};
