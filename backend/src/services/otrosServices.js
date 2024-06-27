const Iras = require("../models/irasModel");
const sequelize = require("sequelize"); // Asegúrate de importar Sequelize
const Sequelize = require("../config/db");
const Provicional = require("../models/provicionalModel");
const { Op, fn, col, literal } = require("sequelize");
const Edas = require("../models/edasModel");
// Importa Provicional si es necesario

const getAnnioIrasServices = async () => {
  console.log("importDataServices: ");
  try {
   response= await Iras.findAll(
    {
        attributes:[[sequelize.fn("DISTINCT", Sequelize.col('ANO')), 'ANO']],
    }
   )
    return response;
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir durante la consulta
    console.error("Error al ejecutar la consulta:", error);
    throw error; // Puedes relanzar el error para manejarlo en otro lugar si es necesario
  }
};
module.exports = {
    getAnnioIrasServices,
  };
  