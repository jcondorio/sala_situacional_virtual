const Iras = require("../models/irasModel");
const sequelize = require("sequelize"); // Asegúrate de importar Sequelize
const Sequelize = require("../config/db");
const Provicional = require("../models/provicionalModel");
const { Op, fn, col, literal } = require("sequelize");
const Edas = require("../models/edasModel");
const jStat = require("jstat");
const math = require("mathjs");
// Importa Provicional si es necesario

const getIrasSemanasServices = async () => {
  //console.log("importDataServices: ");
  try {
    // Paso 1: Obtener años únicos de la tabla `iras`
    const anosResult = await Edas.findAll({
      attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("ANO")), "ano"]],
      raw: true,
    });

    const anos = anosResult.map((row) => row.ano);

    // Paso 2: Generar semanas del 1 al 53
    const semanas = Array.from({ length: 52 }, (_, i) => i + 1);

    // Paso 3: Realizar la consulta principal para obtener los datos existentes
    const result = await Edas.findAll({
      attributes: [
        "SEMANA",
        "ANO",
        [fn("SUM", literal("COALESCE(DAA_C1, 0) + COALESCE(DAA_C1_4, 0) + COALESCE(DAA_C5, 0) + COALESCE(DAA_C5_11, 0) + COALESCE(DAA_C12_17, 0) + COALESCE(DAA_C18_29, 0) + COALESCE(DAA_C30_59, 0) + COALESCE(DAA_C60, 0)")), "Total_IRA"],
        //[Sequelize.literal("SUM(DAA_C1 + DAA_C1_4 + DAA_C5 + DAA_C5_11 + DAA_C12_17 + DAA_C18_29 + DAA_C30_59 + DAA_C60)"), "Total_IRA"],
      ],
      group: ["SEMANA", "ANO"],
      raw: true,
    });
    console.log("resultedas",result)
    // Paso 4: Crear un mapa para acceder fácilmente a los resultados por año y semana
    const resultMap = {};
    result.forEach((row) => {
      const key = `${row.ANO}-${row.SEMANA}`;
      resultMap[key] = row.Total_IRA;
    });

    // Paso 5: Generar los datos completos asegurando que cada combinación de año y semana esté presente
    const completeData = [];
    anos.forEach((ano) => {
      semanas.forEach((semana) => {
        const key = `${ano}-${semana}`;
        completeData.push({
          ANO: ano,
          SEMANA: semana,
          Total_IRA: resultMap[key] || 0,
        });
      });
    });

    // Paso 6: Ordenar los resultados por año y semana
    completeData.sort((a, b) => a.ANO - b.ANO || a.SEMANA - b.SEMANA);

    // Maneja el resultado de la consulta aquí
    ////console.log(completeData);
    return completeData;
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir durante la consulta
    console.error("Error al ejecutar la consulta:", error);
    throw error; // Puedes relanzar el error para manejarlo en otro lugar si es necesario
  }
};

const getIrasUltimaSemanaDistrit = async () => {
  
  try {
    const result = await Edas.findAll({
      attributes: [
        [col("provicional.Dpto"), "Dpto"],
        [col("provicional.Prov"), "Prov"],
        [col("provicional.Distrit"), "Distrit"],
        [fn("SUM", literal("COALESCE(DAA_C1, 0) + COALESCE(DAA_C1_4, 0) + COALESCE(DAA_C5, 0) + COALESCE(DAA_C5_11, 0) + COALESCE(DAA_C12_17, 0) + COALESCE(DAA_C18_29, 0) + COALESCE(DAA_C30_59, 0) + COALESCE(DAA_C60, 0)")), "total_registros"],
      ],
      include: [
        {
          model: Provicional,
          as: "provicional",
          attributes: [],
        },
      ],
      where: {
        SEMANA: {
          [Op.eq]: literal("(SELECT MAX(`SEMANA`) FROM `edas`)"),
        },
      },
      group: ["provicional.Dpto", "provicional.Prov", "provicional.Distrit"],
    });

    ////console.log(result);
    console.log("asd123: ");
    return result;
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir durante la consulta
    console.error("Error al ejecutar la consulta:", error);
    throw error; // Puedes relanzar el error para manejarlo en otro lugar si es necesario
  }
};
const getTotalCasosIrasAnualService = async () => {
  //console.log("getTotalCasosIrasAnualService");
  try {
    const result = await Edas.findOne({
      attributes: [
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("COALESCE(DAA_C1, 0) + COALESCE(DAA_C1_4, 0) + COALESCE(DAA_C5, 0) + COALESCE(DAA_C5_11, 0) + COALESCE(DAA_C12_17, 0) + COALESCE(DAA_C18_29, 0) + COALESCE(DAA_C30_59, 0) + COALESCE(DAA_C60, 0)")
          ),
          "total_registros",
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
        ANO: "2024",
      },
      group: ["provicional.Dpto"],
    });
    return result;
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir durante la consulta
    console.error("Error al ejecutar la consulta:", error);
    throw error; // Puedes relanzar el error para manejarlo en otro lugar si es necesario
  }
};

const getTotalCasosIrasUltimaSemana = async () => {
  //console.log("getTotalCasosIrasUltimaSemana");

  try {
    const result = await Edas.findOne({
      attributes: [
        [

          sequelize.fn(
            "SUM",
            sequelize.literal("COALESCE(DAA_C1, 0) + COALESCE(DAA_C1_4, 0) + COALESCE(DAA_C5, 0) + COALESCE(DAA_C5_11, 0) + COALESCE(DAA_C12_17, 0) + COALESCE(DAA_C18_29, 0) + COALESCE(DAA_C30_59, 0) + COALESCE(DAA_C60, 0)")
          ),
          "total_casos",
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

        SEMANA: {
          [Op.eq]: literal("(SELECT MAX(SEMANA) FROM edas where ANO= (SELECT MAX(ANO) FROM edas))"),
        },
        ANO:{
          [Op.eq]: literal("(SELECT MAX(ANO) FROM edas)"),

        }
      },
      group: ["provicional.Dpto"],
    });
    return result;
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir durante la consulta
    console.error("Error al ejecutar la consulta:", error);
    throw error; // Puedes relanzar el error para manejarlo en otro lugar si es necesario
  }
};

const getTotalDistritosCasosUltimaSemana = async () => {
  try {
    const totalRegistros = await Edas.findOne({
      attributes: [
        [
          sequelize.fn(
            "COUNT",
            sequelize.fn("DISTINCT", sequelize.col("provicional.Distrit"))
          ),
          "total_registros",
        ],
      ],
      include: [
        {
          model: Provicional,
          as: "provicional",
          attributes: [],
          where: {
            COD_EST: sequelize.col("edas.E_SALUD"),
          },
        },
      ],
      where: {
        SEMANA: {
          [Op.eq]: sequelize.literal("(SELECT MAX(SEMANA) FROM edas)"),
        },
        [Op.and]: sequelize.literal("(COALESCE(DAA_C1, 0) + COALESCE(DAA_C1_4, 0) + COALESCE(DAA_C5, 0) + COALESCE(DAA_C5_11, 0) + COALESCE(DAA_C12_17, 0) + COALESCE(DAA_C18_29, 0) + COALESCE(DAA_C30_59, 0) + COALESCE(DAA_C60, 0)COALESCE(DAA_C1, 0) + COALESCE(DAA_C1_4, 0) + COALESCE(DAA_C5, 0) + COALESCE(DAA_C5_11, 0) + COALESCE(DAA_C12_17, 0) + COALESCE(DAA_C18_29, 0) + COALESCE(DAA_C30_59, 0) + COALESCE(DAA_C60, 0)) > 0"),
      },
      raw: true,
    });

    return totalRegistros.total_registros;
  } catch (error) {
    console.error("Error al obtener el total de registros:", error);
    throw error;
  }
};
const getTotalEstrablecimientosCasosUltimaSemana = async () => {
  try {
    const maxAno = await Edas.max("ANO");
    //console.log("maxAno: ", maxAno);
    const totalRegistros = await Edas.findOne({
      attributes: [
        [sequelize.literal("MAX(edas.SEMANA)"), "max_semana"],
        [
          sequelize.fn(
            "COUNT",
            sequelize.fn("DISTINCT", sequelize.col("provicional.N_EESS"))
          ),
          "total_registros",
        ],
      ],
      include: [
        {
          model: Provicional,
          as: "provicional",
          attributes: [],
          where: {
            COD_EST: sequelize.col("edas.E_SALUD"),
          },
        },
      ],
      where: {
        ANO: maxAno,
        SEMANA: {
          [Op.eq]: sequelize.literal(`(SELECT MAX(SEMANA) FROM edas WHERE ANO=${maxAno})`),
        },
        [Op.and]: sequelize.literal("(COALESCE(DAA_C1, 0) + COALESCE(DAA_C1_4, 0) + COALESCE(DAA_C5, 0) + COALESCE(DAA_C5_11, 0) + COALESCE(DAA_C12_17, 0) + COALESCE(DAA_C18_29, 0) + COALESCE(DAA_C30_59, 0) + COALESCE(DAA_C60, 0)) > 0"),
      },
      raw: true,
    });

    //console.log("totalRegistros::", totalRegistros);
    return totalRegistros;
  } catch (error) {
    console.error("Error al obtener el total de registros:", error);
    throw error;
  }
};

const getTotalEstService = async () => {
  try {
    const result = await Provicional.findAll({
      attributes: ["COD_EST", "N_EESS"],
      where: {
        Dpto: "TACNA",
      },
    });
    //console.log("getTotalEstService", result);

    return result;
  } catch (error) {
    console.error("Error al obtener el total de registros:", error);
    throw error;
  }
};

const getTotSemIrasEstService = async (data) => {
  //console.log("getTotSemIrasEstService", data);
  try {
    const query = `
      SELECT 
      all_years.ANO as ANO,
      weeks.num AS SEMANA, 
      
      COALESCE(sum(COALESCE(edas.DAA_C1, 0) + COALESCE(edas.DAA_C1_4, 0) + COALESCE(edas.DAA_C5, 0) + COALESCE(edas.DAA_C5_11, 0) + COALESCE(edas.DAA_C12_17, 0) + COALESCE(edas.DAA_C18_29, 0) + COALESCE(edas.DAA_C30_59, 0) + COALESCE(edas.DAA_C60, 0)), 0) AS Total_IRA
    
FROM 
    (
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
                SELECT MAX(SEMANA) FROM edas
            )
    ) AS weeks
CROSS JOIN 
    (
        SELECT DISTINCT ANO FROM edas
    ) AS all_years
LEFT JOIN 
    edas ON weeks.num = edas.SEMANA AND edas.ANO = all_years.ANO AND edas.E_SALUD = ?
GROUP BY 
    all_years.ANO, weeks.num
ORDER BY 
    all_years.ANO, weeks.num;
`;

    // Ejecutar la consulta
    studentsWithDetails = await Sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: [data.id],
    });
    //console.log("superconsulta:", studentsWithDetails);
    return studentsWithDetails;
  } catch (error) {
    console.error("Error al obtener el total de registros:", error);
    throw error;
  }
};

const getDataDistritService = async () => {
 
  try {
    const maxAno = await Edas.max("ANO");
    //console.log("maxAno: ", maxAno);

    const results = await Sequelize.query(
      `
      SELECT 
          prov.Distrit,
          COALESCE(sum(e.DAA_C1 + e.DAA_C1_4 + e.DAA_C5 + e.DAA_C5_11 + e.DAA_C12_17 + e.DAA_C18_29 + e.DAA_C30_59 + e.DAA_C60), 0) AS casos,
          ${maxAno} AS maximoAno
      FROM 
          provicional AS prov
      LEFT JOIN 
          edas AS e ON e.E_SALUD = prov.COD_EST
                  AND e.ANO = ${maxAno}
      WHERE 
          prov.subregion = 23
      GROUP BY 
          prov.Distrit
      ORDER BY 
          casos DESC;
    `,
      { type: sequelize.QueryTypes.SELECT }
    );
    console.log("getDataDistritServiceedas",results);
    //console.log(results);
    return results;
  } catch (error) {
    console.error("Error al obtener el total de registros:", error);
    throw error;
  }
};
const getDatosGeneralesServices = async (annio) => {
  //console.log("getDatosGeneralesServices", annio);
  try {
    const maxAno = annio.annio;
    //console.log("maxAno: ", maxAno);


    const resultTotIras = await Sequelize.query(
      `
      Select sum(COALESCE(DAA_C1, 0) + COALESCE(DAA_C1_4, 0) + COALESCE(DAA_C5, 0) + COALESCE(DAA_C5_11, 0) + COALESCE(DAA_C12_17, 0) + COALESCE(DAA_C18_29, 0) + COALESCE(DAA_C30_59, 0) + COALESCE(DAA_C60, 0)) as result FROM edas where ANO=?
      `,
      {
        replacements: [maxAno],
        type: Sequelize.QueryTypes.SELECT
      }

    );
    const resultTotUltimaSemana = await Sequelize.query(
      `
      select sum(COALESCE(DAA_C1, 0) + COALESCE(DAA_C1_4, 0) + COALESCE(DAA_C5, 0) + COALESCE(DAA_C5_11, 0) + COALESCE(DAA_C12_17, 0) + COALESCE(DAA_C18_29, 0) + COALESCE(DAA_C30_59, 0) + COALESCE(DAA_C60, 0)) as result from edas where ANO=? and SEMANA=(select max(SEMANA) from edas where ANO=?)
     `,
      {
        replacements: [maxAno, maxAno],
        type: Sequelize.QueryTypes.SELECT
      }
    );
    const resultTotDistSemana = await Sequelize.query(
      `
        select count( distinct prov.Distrit) as result from edas as e inner join provicional as prov on e.E_SALUD=prov.COD_EST 
        where e.ANO=?  and SEMANA=(select max(SEMANA) from edas where ANO=?);
      `
      ,
      {
        replacements: [maxAno, maxAno],
        type: Sequelize.QueryTypes.SELECT
      }
    )
    const resultTotEstSemana = await Sequelize.query(
      `
        select count( distinct prov.N_EESS) as result from edas as e inner join provicional as prov on e.E_SALUD=prov.COD_EST 
        where e.ANO=?  and SEMANA=(select max(SEMANA) from edas where ANO=?);
      `
      ,
      {
        replacements: [maxAno, maxAno],
        type: Sequelize.QueryTypes.SELECT
      }
    )
    const cantidadSemanas = await Sequelize.query(
      `
         select max(SEMANA) as result FROM edas where ANO=?;
      `
      ,
      {
        replacements: [maxAno],
        type: Sequelize.QueryTypes.SELECT
      }
    )
    //console.log("cantidadSemanas", cantidadSemanas);
    //consolidado
    const consolidado = {
      totiras: resultTotIras[0].result,
      totUltSemana: resultTotUltimaSemana[0].result,
      totDistUltSem: resultTotDistSemana[0].result,
      totEstUltSem: resultTotEstSemana[0].result,
      cantidadSemanas: cantidadSemanas[0].result,
    }
    return consolidado;
  } catch (error) {
    console.error("Error al obtener el total de registros:", error);
    throw error;
  }
};


const getcasesemanadistritServices = async (data) => {
  //console.log("getcasesemanadistritServices", data);
  try {
    const maxAno = data.annio;
    //console.log("maxAno: ", maxAno);


    const resultTotUltimaSemana = await Sequelize.query(
      `
      select sum(COALESCE(DAA_C1, 0) + COALESCE(DAA_C1_4, 0) + COALESCE(DAA_C5, 0) + COALESCE(DAA_C5_11, 0) + COALESCE(DAA_C12_17, 0) + COALESCE(DAA_C18_29, 0) + COALESCE(DAA_C30_59, 0) + COALESCE(DAA_C60, 0)) as result from edas where ANO=? and SEMANA=?
     `,
      {
        replacements: [maxAno, data.semana],
        type: Sequelize.QueryTypes.SELECT
      }
    );
    const resultTotDistSemana = await Sequelize.query(
      `
        select count( distinct prov.Distrit) as result from edas as e inner join provicional as prov on e.E_SALUD=prov.COD_EST 
        where e.ANO=?  and SEMANA=?;
      `
      ,
      {
        replacements: [maxAno, data.semana],
        type: Sequelize.QueryTypes.SELECT
      }
    )
    const resultTotEstSemana = await Sequelize.query(
      `
        select count( distinct prov.N_EESS) as result from edas as e inner join provicional as prov on e.E_SALUD=prov.COD_EST 
        where e.ANO=?  and SEMANA=?;
      `
      ,
      {
        replacements: [maxAno, data.semana],
        type: Sequelize.QueryTypes.SELECT
      }
    )
    //consolidado
    const consolidado = {
      totUltSemana: resultTotUltimaSemana[0].result,
      totDistUltSem: resultTotDistSemana[0].result,
      totEstUltSem: resultTotEstSemana[0].result,
    }
    return consolidado;
  } catch (error) {
    console.error("Error al obtener el total de registros:", error);
    throw error;
  }
};


const getCasosDistritUltSemServices = async (annio) => {
  try {
    //console.log("getCasosDistritUltSemServices", annio);

    // Paso 1: Obtener la semana máxima
    const maxSemana = await Edas.max("SEMANA", {
      where: {
        ANO: annio.annio,
      },
    });

    // Paso 2: Consulta principal usando la semana máxima obtenida
    const result = await Edas.findAll({
      attributes: [
        [Sequelize.col("provicional.Dpto"), "Dpto"],
        [Sequelize.col("provicional.Prov"), "Prov"],
        [Sequelize.col("provicional.Distrit"), "Distrit"],
        [Sequelize.fn("SUM", Sequelize.literal("COALESCE(DAA_C1, 0) + COALESCE(DAA_C1_4, 0) + COALESCE(DAA_C5, 0) + COALESCE(DAA_C5_11, 0) + COALESCE(DAA_C12_17, 0) + COALESCE(DAA_C18_29, 0) + COALESCE(DAA_C30_59, 0) + COALESCE(DAA_C60, 0)")), "total_registros"],
      ],
      include: [
        {
          model: Provicional,
          as: "provicional",
          attributes: [],
        },
      ],
      where: {
        ANO: annio.annio,
        SEMANA: maxSemana, // Usamos la semana máxima obtenida
      },
      group: ["provicional.Dpto", "provicional.Prov", "provicional.Distrit"],
    });

    //console.log("getCasosDistritUltSemServices:", result);
    return result;
  } catch (error) {
    console.error("Error al obtener el total de registros:", error);
    throw error;
  }
};
const getCasosDistritSemServices = async (data) => {
  try {
    //console.log("getCasosDistritSemServices", data);

    // Paso 2: Consulta principal usando la semana máxima obtenida
    const result = await Edas.findAll({
      attributes: [
        [Sequelize.col("provicional.Dpto"), "Dpto"],
        [Sequelize.col("provicional.Prov"), "Prov"],
        [Sequelize.col("provicional.Distrit"), "Distrit"],
        [Sequelize.fn("SUM", Sequelize.literal("COALESCE(DAA_C1, 0) + COALESCE(DAA_C1_4, 0) + COALESCE(DAA_C5, 0) + COALESCE(DAA_C5_11, 0) + COALESCE(DAA_C12_17, 0) + COALESCE(DAA_C18_29, 0) + COALESCE(DAA_C30_59, 0) + COALESCE(DAA_C60, 0)")), "total_registros"],
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
        SEMANA: data.semana, // Usamos la semana máxima obtenida
      },
      group: ["provicional.Dpto", "provicional.Prov", "provicional.Distrit"],
    });

    //console.log("getCasosDistritUltSemServices:", result);
    return result;
  } catch (error) {
    console.error("Error al obtener el total de registros:", error);
    throw error;
  }
};
const getgrafico2Services = async (data) => {
  //console.log("getTotSemIrasEstService", data);
  try {
    const query = `
     SELECT weeks.num AS SEMANA, SUM(COALESCE(edas.DAA_C1,0) + COALESCE(edas.DAA_C1_4,0) + COALESCE(edas.DAA_C5,0) + COALESCE(edas.DAA_C5_11,0) + COALESCE(edas.DAA_C12_17,0) + COALESCE(edas.DAA_C18_29,0) + COALESCE(edas.DAA_C30_59,0) + COALESCE(edas.DAA_C60,0)) AS cantidad_registros
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
            SELECT MAX(SEMANA) FROM edas where edas.ANO=?
        )
) AS weeks
LEFT JOIN edas ON weeks.num = edas.SEMANA AND edas.E_SALUD =? AND edas.ANO=?
GROUP BY weeks.num 
ORDER BY semana;
    `;

    // Ejecutar la consulta
    studentsWithDetails = await Sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: [data.annio, data.estacion,data.annio],
    });
    //console.log("superconsulta:", studentsWithDetails);
    return studentsWithDetails;
  } catch (error) {
    console.error("Error al obtener el total de registros:", error);
    throw error;
  }
};
const getgrafico3Services = async (data) => {
  //console.log("getTotSemIrasEstService", data);
  try {
    const query = `
      SELECT 
      SEMANA, 
      SUM(COALESCE(edas.DAA_C1,0) + COALESCE(edas.DAA_C1_4,0) + COALESCE(edas.DAA_C5,0) + COALESCE(edas.DAA_C5_11,0) + COALESCE(edas.DAA_C12_17,0) + COALESCE(edas.DAA_C18_29,0) + COALESCE(edas.DAA_C30_59,0) + COALESCE(edas.DAA_C60,0)) AS Total_IRA
      from edas as e inner join provicional as prov on prov.COD_EST=e.E_SALUD
      where prov.Distrit=? and e.ANO=?
    `;

    // Ejecutar la consulta
    studentsWithDetails = await Sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: [data.annio, data.estacion],
    });
    //console.log("superconsulta:", studentsWithDetails);
    return studentsWithDetails;
  } catch (error) {
    console.error("Error al obtener el total de registros:", error);
    throw error;
  }
};


const getgrafico4Services = async (data) => {
  ////console.log("getTotSemIrasEstService", data);
  try {
    const query = `
      SELECT weeks.num AS SEMANA, SUM(COALESCE(edas.DAA_C1,0) + COALESCE(edas.DAA_C1_4,0) + COALESCE(edas.DAA_C5,0) + COALESCE(edas.DAA_C5_11,0) + COALESCE(edas.DAA_C12_17,0) + COALESCE(edas.DAA_C18_29,0) + COALESCE(edas.DAA_C30_59,0) + COALESCE(edas.DAA_C60,0)) AS cantidad_registros
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
                  SELECT MAX(SEMANA) FROM edas where edas.ANO=?
              )
      ) AS weeks
      LEFT JOIN edas ON weeks.num = edas.SEMANA inner join provicional as prov on prov.COD_EST=edas.E_SALUD
      where edas.ANO=? and prov.Distrit=?
      GROUP BY weeks.num 
      ORDER BY semana;
    `;

    // Ejecutar la consulta
    studentsWithDetails = await Sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: [data.annio,data.annio, data.distrito],
    });
    //console.log("superconsulta:", studentsWithDetails);
    return studentsWithDetails;
  } catch (error) {
    console.error("Error al obtener el total de registros:", error);
    throw error;
  }
};

const endemicoIrasServices = async (annio) => {
  console.log("endemicoIrasServices", annio.annio);
  try {
    const query = `
SELECT 
    AVG(de_ic.logn) AS promedio,
    STDDEV_POP(de_ic.logn) AS ln_de, 
    SQRT(COUNT(de_ic.SEMANA)) AS ic_inf,
    SQRT(COUNT(de_ic.SEMANA)) AS ic_sup,
    COUNT(de_ic.SEMANA) AS contara,
    (SELECT SUM(pobl.men_5) 
     FROM poblacion AS pobl 
     INNER JOIN annios_endemicos_edas AS iend 
     ON iend.nom_annio_endemico = pobl.ano
     WHERE pobl.disa = "TACNA" 
     AND pobl.ano = (SELECT MAX(nom_annio_endemico) FROM annios_endemicos_edas)
     GROUP BY pobl.ano 
     ORDER BY pobl.ano) AS max_poblacion
FROM (
    SELECT
        i.ANO, 
        i.SEMANA, 
        SUM(
            COALESCE(i.DAA_C1, 0) + COALESCE(i.DAA_C1_4, 0) + COALESCE(i.DAA_C5, 0) + 
            COALESCE(i.DAA_C5_11, 0) + COALESCE(i.DAA_C12_17, 0) + COALESCE(i.DAA_C18_29, 0) +
            COALESCE(i.DAA_C30_59, 0) + COALESCE(i.DAA_C60, 0)
        ) AS casos, 
        pobl.poblacion, 
        (SUM(
            COALESCE(i.DAA_C1, 0) + COALESCE(i.DAA_C1_4, 0) + COALESCE(i.DAA_C5, 0) + 
            COALESCE(i.DAA_C5_11, 0) + COALESCE(i.DAA_C12_17, 0) + COALESCE(i.DAA_C18_29, 0) +
            COALESCE(i.DAA_C30_59, 0) + COALESCE(i.DAA_C60, 0)
        ) / pobl.poblacion * 100000) + 1 AS tasa_i,
        LN((SUM(
            COALESCE(i.DAA_C1, 0) + COALESCE(i.DAA_C1_4, 0) + COALESCE(i.DAA_C5, 0) + 
            COALESCE(i.DAA_C5_11, 0) + COALESCE(i.DAA_C12_17, 0) + COALESCE(i.DAA_C18_29, 0) +
            COALESCE(i.DAA_C30_59, 0) + COALESCE(i.DAA_C60, 0)
        ) / pobl.poblacion * 100000) + 1) AS logn
    FROM edas AS i 
    INNER JOIN annios_endemicos_edas AS iend 
    ON i.ANO = iend.nom_annio_endemico
    INNER JOIN (
        SELECT pobl.ano, SUM(pobl.men_5) AS poblacion 
        FROM poblacion AS pobl 
        WHERE pobl.disa = "TACNA" 
        GROUP BY pobl.ano 
        ORDER BY pobl.ano
    ) AS pobl 
    ON pobl.ano = iend.nom_annio_endemico
    WHERE i.SEMANA <= 52 
    AND iend.nom_annio_endemico < ?
    GROUP BY i.ANO, i.SEMANA 
    ORDER BY i.ANO, i.SEMANA
) AS de_ic 
GROUP BY de_ic.SEMANA;

    `;
    const studentsWithDetails = await Sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: [annio.annio],
    });
    console.log("endemicoIrasServices: ", studentsWithDetails);
    const cal_student = studentsWithDetails.map((item) => ({
      ...item,
      ic_inf:
        item.promedio -
        (jStat.studentt.inv(0.975, item.contara) * item.ln_de) / item.ic_inf,
      ic_sup:
        item.promedio +
        (jStat.studentt.inv(0.975, item.contara) * item.ln_de) / item.ic_sup,
    }));
    console.log("cal_student", cal_student);
    let bloque_5 = [];
    cal_student.forEach((item) => {
      bloque_5.push({
        ic_inf_tasa: Math.exp(item.ic_inf) - 1,
        media_tasa: Math.exp(item.promedio) - 1,
        ic_sup_tasa: Math.exp(item.ic_sup) - 1,
        ic_inf_casos:
          ((Math.exp(item.ic_inf) - 1) * item.max_poblacion) / 100000,
        media_casos:
          ((Math.exp(item.promedio) - 1) * item.max_poblacion) / 100000,
        ic_sup_casos:
          ((Math.exp(item.ic_sup) - 1) * item.max_poblacion) / 100000,
      });
    });
    let bloque_6 = [];
    bloque_5.forEach((item) => {
      bloque_6.push({
        ic_inf: parseFloat(item.ic_inf_casos.toFixed(2)),
        media_ic_inf: parseFloat(
          (item.media_casos - item.ic_inf_casos).toFixed(2)
        ),
        media_ic_sup: parseFloat(
          (item.ic_sup_casos - item.media_casos).toFixed(2)
        ),
      });
    });

    if (bloque_6.length > 0) {
      bloque_6.unshift({
        ic_inf: bloque_6[0].ic_inf,
        media_ic_inf: bloque_6[0].media_ic_inf,
        media_ic_sup: bloque_6[0].media_ic_sup,
      });
    } else {
      console.error(
        "Error: bloque_6 está vacío, no se puede agregar el elemento inicial."
      );
    }

    return bloque_6;
  } catch (error) {
    console.error("Error al obtener el total de registros:", error);
    throw error;
  }
};

const getAnnioIrasService = async (annio) => {
  try {
    console.log("getAnnioIrasService123", annio.annio);
    const query = `
      WITH weeks AS (
            SELECT num AS SEMANA
            FROM (
                SELECT 1 AS num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
                UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15 UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19 UNION SELECT 20
                UNION SELECT 21 UNION SELECT 22 UNION SELECT 23 UNION SELECT 24 UNION SELECT 25 UNION SELECT 26 UNION SELECT 27 UNION SELECT 28 UNION SELECT 29 UNION SELECT 30
                UNION SELECT 31 UNION SELECT 32 UNION SELECT 33 UNION SELECT 34 UNION SELECT 35 UNION SELECT 36 UNION SELECT 37 UNION SELECT 38 UNION SELECT 39 UNION SELECT 40
                UNION SELECT 41 UNION SELECT 42 UNION SELECT 43 UNION SELECT 44 UNION SELECT 45 UNION SELECT 46 UNION SELECT 47 UNION SELECT 48 UNION SELECT 49 UNION SELECT 50
                UNION SELECT 51 UNION SELECT 52
            ) AS all_weeks
        )
        SELECT 
            weeks.SEMANA,
            SUM(COALESCE(edas.DAA_C1,0) + COALESCE(edas.DAA_C1_4,0) + COALESCE(edas.DAA_C5,0) + COALESCE(edas.DAA_C5_11,0) + COALESCE(edas.DAA_C12_17,0) + COALESCE(edas.DAA_C18_29,0) + COALESCE(edas.DAA_C30_59,0) + COALESCE(edas.DAA_C60,0)) AS casos
        FROM weeks
        LEFT JOIN edas 
            ON weeks.SEMANA = edas.SEMANA 
            AND edas.ANO = ?
        GROUP BY weeks.SEMANA
        ORDER BY weeks.SEMANA;

  `;
    studentsWithDetails = await Sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: [annio.annio],
    });

    return studentsWithDetails;
  } catch (error) {
    console.error("Error al obtener el total de registros:", error);
    throw error;
  }
};

const distritoonemapService = async (data) => {
  try {
    console.log("distritoonemapService",data);
    const query = `
      SELECT IFNULL(prov.N_EESS, 'Sin nombre') AS N_EESS,
       IFNULL(SUM(COALESCE(e.DAA_C1, 0) + COALESCE(e.DAA_C1_4, 0) + COALESCE(e.DAA_C5, 0)+ COALESCE(e.DAA_C5_11, 0)+ COALESCE(e.DAA_C12_17, 0)+ COALESCE(e.DAA_C18_29, 0)+ COALESCE(e.DAA_C30_59, 0)+ COALESCE(e.DAA_C60, 0)), 0) AS casos
        FROM provicional AS prov
        LEFT JOIN edas AS e ON e.E_SALUD = prov.COD_EST
          AND e.SEMANA = ?
          AND e.ANO = ?
        WHERE prov.Distrit = ?
        GROUP BY prov.N_EESS
        ORDER BY prov.N_EESS;
  `;
    studentsWithDetails = await Sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: [data.semana,data.annio,data.distrito],
    });
    console.log("distritoonemapService_ress",studentsWithDetails)
    return studentsWithDetails;
  } catch (error) {
    console.error("Error al obtener el total de registros:", error);
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
  getDataDistritService,
  getDatosGeneralesServices,
  getCasosDistritUltSemServices,
  getcasesemanadistritServices,
  getCasosDistritSemServices,
  getgrafico2Services,
  getgrafico4Services,
  endemicoIrasServices,
  getAnnioIrasService,
  distritoonemapService,
};
