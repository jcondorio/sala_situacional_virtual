const Iras = require("../models/irasModel");
const   sequelize = require('sequelize'); // Asegúrate de importar Sequelize
const Sequelize = require("../config/db")
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
    const totalRegistros = await Iras.findOne({
      attributes: [
        [
          sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('provicional.Distrit'))),
          'total_registros'
        ]
      ],
      include: [
        {
          model: Provicional,
          as: 'provicional',
          attributes: [],
          where: {
            COD_EST: sequelize.col('iras.E_SALUD')
          }
        }
      ],
      where: {
        SEMANA: {
          [Op.eq]: sequelize.literal('(SELECT MAX(SEMANA) FROM iras)')
        },
        [Op.and]: sequelize.literal('(IRA_M2 + IRA_2_11 + IRA_1_4A) > 0')
      },
      raw: true
    });

    return totalRegistros.total_registros;
  } catch (error) {
    console.error('Error al obtener el total de registros:', error);
    throw error;
  }
};


const getTotalEstrablecimientosCasosUltimaSemana = async () => {
  try {
    const totalRegistros = await Iras.findOne({
      attributes: [
        [
          sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('provicional.N_EESS'))),
          'total_registros'
        ]
      ],
      include: [
        {
          model: Provicional,
          as: 'provicional',
          attributes: [],
          where: {
            COD_EST: sequelize.col('iras.E_SALUD')
          }
        }
      ],
      where: {
        SEMANA: {
          [Op.eq]: sequelize.literal('(SELECT MAX(SEMANA) FROM iras)')
        },
        [Op.and]: sequelize.literal('(IRA_M2 + IRA_2_11 + IRA_1_4A) > 0')
      },
      raw: true
    });

    return totalRegistros.total_registros;
  } catch (error) {
    console.error('Error al obtener el total de registros:', error);
    throw error;
  }
};


const getTotalEstService = async () => {

  try {
    const result = await Provicional.findAll({
      attributes: ['COD_EST', 'N_EESS'],
      where: {
        Dpto: "TACNA"
      },
    });
    console.log("getTotalEstService", result);

    return result;
  } catch (error) {
    console.error('Error al obtener el total de registros:', error);
    throw error;
  }
};

const getTotSemIrasEstService = async (data) => {
  console.log("getTotSemIrasEstService",data)
  try {
    const query = `
SELECT weeks.num AS SEMANA, COALESCE(SUM(iras.IRA_M2 + iras.IRA_2_11 + iras.IRA_1_4A), 0) AS cantidad_registros
FROM (
    SELECT 
        ones.num + tens.num * 10 + hundreds.num * 100 AS num
    FROM
        (SELECT 1 AS num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) AS ones
        CROSS JOIN
        (SELECT 0 AS num UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) AS tens
        CROSS JOIN
        (SELECT 0 AS num UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) AS hundreds
    WHERE 
        ones.num + tens.num * 10 + hundreds.num * 100 <= (
            SELECT MAX(SEMANA) FROM iras
        )
) AS weeks
LEFT JOIN iras ON weeks.num = iras.SEMANA AND iras.E_SALUD = ?
GROUP BY weeks.num 
ORDER BY semana;
`;

    // Ejecutar la consulta
    studentsWithDetails = await Sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: [data.id]
    });
    console.log("superconsulta:",studentsWithDetails)
    return studentsWithDetails;
  } catch (error) {
    console.error('Error al obtener el total de registros:', error);
    throw error;
  }
};
module.exports = {
  getIrasSemanasServices,
  getIrasUltimaSemanaDistrit,
  getTotalCasosIrasAnualService,
  getTotalCasosIrasUltimaSemana,
  getTotalDistritosCasosUltimaSemana,
  getTotalEstrablecimientosCasosUltimaSemana,
  getTotalEstService,
  getTotSemIrasEstService,
};
