const Iras = require("../models/irasModel");
const sequelize = require("sequelize"); // Asegúrate de importar Sequelize
const Sequelize = require("../config/db");
const Provicional = require("../models/provicionalModel");
const { Op, fn, col, literal } = require("sequelize");
const Edas = require("../models/edasModel");
const Poblacion = require("../models/poblacionModel");
// Importa Provicional si es necesario

const getPobDistritServices = async (data) => {
    //console.log("getPobDistritServices: ", data);
    try {
      // Obtener la población de los distritos
      const resultPobl = await Poblacion.findAll({
        attributes: ['distrito', 'pobtot'],
        where: {
          ano: data.annio,
          cod_disa: 23
        }
      });
  
      // Obtener los casos de IRA desde la semana 1 hasta la semana proporcionada
      const regultCasosPobl = await Iras.findAll({
        attributes: [
          [Sequelize.col("provicional.Distrit"), "Distrit"],
          [Sequelize.fn("SUM", Sequelize.literal("IRA_M2 + IRA_2_11 + IRA_1_4A")), "total_registros"],
        ],
        include: [
          {
            model: Provicional,
            as: "provicional",
            attributes: [],
          },
        ],
        where: {
          ANO: data.annio,
          SEMANA: {
            [Op.between]: [1, data.semana]
          }
        },
        group: ["provicional.Distrit"],
      });
  
      const completeData = [];
      resultPobl.forEach((poblacion) => {
        regultCasosPobl.forEach((casos) => {
          if (poblacion.distrito === casos.get('Distrit')) {
            completeData.push({
              distrito: poblacion.distrito,
              tia: ((casos.get('total_registros') / poblacion.pobtot) * 1000),
            });
          }
        });
      });
  
      //console.log("completeData", completeData);
      return completeData;
    } catch (error) {
      console.error("Error al ejecutar la consulta:", error);
      throw error;
    }
  };
  
  const getPobDistritEdasServices = async (data) => {
    
    try {
      // Obtener la población de los distritos
      const resultPobl = await Poblacion.findAll({
        attributes: ['distrito', 'men_5'],
        where: {
          ano: data.annio,
          cod_disa: 23
        }
      });
  
      // Obtener los casos de EDAS desde la semana 1 hasta la semana proporcionada
      const regultCasosPobl = await Edas.findAll({
        attributes: [
          [Sequelize.col("provicional.Distrit"), "Distrit"],
    [
  Sequelize.fn(
    "SUM",
    Sequelize.literal(`
      COALESCE(DAA_C1, 0) +
      COALESCE(DAA_C1_4, 0) +
      COALESCE(DAA_C5, 0) +
      COALESCE(DAA_C5_11, 0) +
      COALESCE(DAA_C12_17, 0) +
      COALESCE(DAA_C18_29, 0) +
      COALESCE(DAA_C30_59, 0) +
      COALESCE(DAA_C60, 0)
    `)
  ),
  "total_registros"
],
 ],
        include: [
          {
            model: Provicional,
            as: "provicional",
            attributes: [],
          },
        ],
        where: {
          ANO: data.annio,
          SEMANA: {
            [Op.between]: [1, data.semana]
          }
        },
        group: ["provicional.Distrit"],
      });
      console.log("datadeedas: ", resultPobl);
  
      const completeData = [];
      resultPobl.forEach((poblacion) => {
        regultCasosPobl.forEach((casos) => {
          if (poblacion.distrito === casos.get('Distrit')) {
            completeData.push({
              distrito: poblacion.distrito,
              tia: ((casos.get('total_registros') / poblacion.men_5) * 1000),
            });
          }
        });
      });
  
      console.log("completo edas", completeData);
      return completeData;
    } catch (error) {
      console.error("Error al ejecutar la consulta:", error);
      throw error;
    }
  };
  module.exports = {
    getPobDistritServices,
    getPobDistritEdasServices,
  };