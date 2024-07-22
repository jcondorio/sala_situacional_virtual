const Iras = require("../models/irasModel");
const sequelize = require("sequelize"); // Asegúrate de importar Sequelize
const Sequelize = require("../config/db");
const Provicional = require("../models/provicionalModel");
const { Op, fn, col, literal } = require("sequelize");
const Edas = require("../models/edasModel");
// Importa Provicional si es necesario

const getAnnioIrasServices = async () => {
  try {
    const response = await Iras.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", Sequelize.col('ANO')), 'ANO']
      ]
    });

    console.log("getAnnioIrasServices: ", response);
    return response;
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    throw error; // Puedes relanzar el error para manejarlo en otro lugar si es necesario
  }
};
const getAnnioEdasServices = async () => {
  ////console.log("importDataServices: ");
  try {
    response = await Edas.findAll(
      {
        attributes: [[sequelize.fn("DISTINCT", Sequelize.col('ANO')), 'ANO']],
      }
    )
    return response;
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
  }
};const getCheckedIrasServices = async () => {
  try {
    // Iniciar una transacción en Sequelize
    const results = await Sequelize.transaction(async (t) => {
      // Crear tabla temporal para almacenar años estáticos únicos
      await Sequelize.query(`
        CREATE TEMPORARY TABLE annios_estaticos AS
        SELECT DISTINCT ANO FROM iras;
      `, { transaction: t });

      // Realizar la consulta para obtener el resultado deseado
      const data = await Sequelize.query(`
        SELECT
          a.ANO AS ano,
          CASE WHEN d.nom_annio_endemico IS NOT NULL THEN true ELSE false END AS estado
        FROM
          annios_estaticos AS a
          LEFT JOIN annios_endemicos_iras AS d ON a.ANO = d.nom_annio_endemico;
      `, { type: Sequelize.QueryTypes.SELECT, transaction: t });

      // Eliminar la tabla temporal al finalizar las operaciones
      await Sequelize.query(`
        DROP TEMPORARY TABLE IF EXISTS annios_estaticos;
      `, { transaction: t });

      return data; // Devolver los resultados obtenidos
    });

    return results;
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    throw error;
  }
};
module.exports = {
  getAnnioIrasServices,
  getAnnioEdasServices,
  getCheckedIrasServices,
};
