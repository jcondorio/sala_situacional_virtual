const Iras = require("../models/irasModel");
const sequelize = require("sequelize"); // Asegúrate de importar Sequelize
const Sequelize = require("../config/db");
const Provicional = require("../models/provicionalModel");
const { Op, fn, col, literal } = require("sequelize");
// Importa Provicional si es necesario

const getIrasSemanasServices = async () => {
  console.log("importDataServices: ");
  try {
    // Paso 1: Obtener años únicos de la tabla `iras`
    const anosResult = await Iras.findAll({
      attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("ANO")), "ano"]],
      raw: true,
    });

    const anos = anosResult.map((row) => row.ano);

    // Paso 2: Generar semanas del 1 al 53
    const semanas = Array.from({ length: 52 }, (_, i) => i + 1);

    // Paso 3: Realizar la consulta principal para obtener los datos existentes
    const result = await Iras.findAll({
      attributes: [
        "SEMANA",
        "ANO",
        [Sequelize.literal("SUM(IRA_M2 + IRA_2_11 + IRA_1_4A)"), "Total_IRA"],
      ],
      group: ["SEMANA", "ANO"],
      raw: true,
    });

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
    console.log(completeData);
    return completeData;
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir durante la consulta
    console.error("Error al ejecutar la consulta:", error);
    throw error; // Puedes relanzar el error para manejarlo en otro lugar si es necesario
  }
};

const getIrasUltimaSemanaDistrit = async () => {
  console.log("importDataServices: ");
  try {
    const result = await Iras.findAll({
      attributes: [
        [col("provicional.Dpto"), "Dpto"],
        [col("provicional.Prov"), "Prov"],
        [col("provicional.Distrit"), "Distrit"],
        [fn("SUM", literal("IRA_M2 + IRA_2_11 + IRA_1_4A")), "total_registros"],
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
          [Op.eq]: literal("(SELECT MAX(`SEMANA`) FROM `iras`)"),
        },
      },
      group: ["provicional.Dpto", "provicional.Prov", "provicional.Distrit"],
    });

    console.log(result);
    return result;
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir durante la consulta
    console.error("Error al ejecutar la consulta:", error);
    throw error; // Puedes relanzar el error para manejarlo en otro lugar si es necesario
  }
};
const getTotalCasosIrasAnualService = async () => {
  console.log("getTotalCasosIrasAnualService");
  try {
    const result = await Iras.findOne({
      attributes: [
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("IRA_M2 + IRA_2_11 + IRA_1_4A")
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
  console.log("getTotalCasosIrasUltimaSemana");

  try {
    const result = await Iras.findOne({
      attributes: [
        [

          sequelize.fn(
            "SUM",
            sequelize.literal("IRA_M2 + IRA_2_11 + IRA_1_4A")
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
        ANO: 2024,
        SEMANA: {
          [Op.eq]: literal("(SELECT MAX(`SEMANA`) FROM `iras`)"),
        },
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
    const totalRegistros = await Iras.findOne({
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
            COD_EST: sequelize.col("iras.E_SALUD"),
          },
        },
      ],
      where: {
        SEMANA: {
          [Op.eq]: sequelize.literal("(SELECT MAX(SEMANA) FROM iras)"),
        },
        [Op.and]: sequelize.literal("(IRA_M2 + IRA_2_11 + IRA_1_4A) > 0"),
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
    const maxAno = await Iras.max("ANO");
    console.log("maxAno: ", maxAno);
    const totalRegistros = await Iras.findOne({
      attributes: [
        [sequelize.literal("MAX(iras.SEMANA)"), "max_semana"],
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
            COD_EST: sequelize.col("iras.E_SALUD"),
          },
        },
      ],
      where: {
        ANO: maxAno,
        SEMANA: {
          [Op.eq]: sequelize.literal(`(SELECT MAX(SEMANA) FROM iras WHERE ANO=${maxAno})`),
        },
        [Op.and]: sequelize.literal("(IRA_M2 + IRA_2_11 + IRA_1_4A) > 0"),
      },
      raw: true,
    });

    console.log("totalRegistros::", totalRegistros);
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
    console.log("getTotalEstService", result);

    return result;
  } catch (error) {
    console.error("Error al obtener el total de registros:", error);
    throw error;
  }
};

const getTotSemIrasEstService = async (data) => {
  console.log("getTotSemIrasEstService", data);
  try {
    const query = `
      SELECT 
      all_years.ANO as ANO,
      weeks.num AS SEMANA, 
      COALESCE(SUM(iras.IRA_M2 + iras.IRA_2_11 + iras.IRA_1_4A), 0) AS Total_IRA
    
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
                SELECT MAX(SEMANA) FROM iras
            )
    ) AS weeks
CROSS JOIN 
    (
        SELECT DISTINCT ANO FROM iras
    ) AS all_years
LEFT JOIN 
    iras ON weeks.num = iras.SEMANA AND iras.ANO = all_years.ANO AND iras.E_SALUD = ?
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
    console.log("superconsulta:", studentsWithDetails);
    return studentsWithDetails;
  } catch (error) {
    console.error("Error al obtener el total de registros:", error);
    throw error;
  }
};

const getDataDistritService = async () => {
  console.log("getDataDistritService");
  try {
    const maxAno = await Iras.max("ANO");
    console.log("maxAno: ", maxAno);

    const results = await Sequelize.query(
      `
      SELECT 
          prov.Distrit,
          COALESCE(SUM(i.IRA_M2 + i.IRA_2_11 + i.IRA_1_4A), 0) AS casos,
          ${maxAno} AS maximoAno
      FROM 
          provicional AS prov
      LEFT JOIN 
          iras AS i ON i.E_SALUD = prov.COD_EST
                  AND i.ANO = ${maxAno}
      WHERE 
          prov.subregion = 23
      GROUP BY 
          prov.Distrit
      ORDER BY 
          casos DESC;
    `,
      { type: sequelize.QueryTypes.SELECT }
    );

    console.log(results);
    return results;
  } catch (error) {
    console.error("Error al obtener el total de registros:", error);
    throw error;
  }
};
const getDatosGeneralesServices = async (annio) => {
  console.log("getDatosGeneralesServices", annio);
  try {
    const maxAno = annio.annio;
    console.log("maxAno: ", maxAno);


    const resultTotIras = await Sequelize.query(
      `
      Select sum(IRA_M2+IRA_2_11+IRA_1_4A) as result FROM iras where ANO=?
      `,
      {
        replacements: [maxAno],
        type: Sequelize.QueryTypes.SELECT
      }

    );
    const resultTotUltimaSemana = await Sequelize.query(
      `
      select sum(IRA_M2+IRA_2_11+IRA_1_4A) as result from iras where ANO=? and SEMANA=(select max(SEMANA) from iras where ANO=?)
     `,
      {
        replacements: [maxAno, maxAno],
        type: Sequelize.QueryTypes.SELECT
      }
    );
    const resultTotDistSemana = await Sequelize.query(
      `
        select count( distinct prov.Distrit) as result from iras as i inner join provicional as prov on i.E_SALUD=prov.COD_EST 
        where i.ANO=?  and SEMANA=(select max(SEMANA) from iras where ANO=?);
      `
      ,
      {
        replacements: [maxAno, maxAno],
        type: Sequelize.QueryTypes.SELECT
      }
    )
    const resultTotEstSemana = await Sequelize.query(
      `
        select count( distinct prov.N_EESS) as result from iras as i inner join provicional as prov on i.E_SALUD=prov.COD_EST 
        where i.ANO=?  and SEMANA=(select max(SEMANA) from iras where ANO=?);
      `
      ,
      {
        replacements: [maxAno, maxAno],
        type: Sequelize.QueryTypes.SELECT
      }
    )
    const cantidadSemanas = await Sequelize.query(
      `
         select max(SEMANA) as result FROM iras where ANO=?;
      `
      ,
      {
        replacements: [maxAno],
        type: Sequelize.QueryTypes.SELECT
      }
    )
    console.log("cantidadSemanas", cantidadSemanas);
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
  console.log("getcasesemanadistritServices", data);
  try {
    const maxAno = data.annio;
    console.log("maxAno: ", maxAno);


    const resultTotUltimaSemana = await Sequelize.query(
      `
      select sum(IRA_M2+IRA_2_11+IRA_1_4A) as result from iras where ANO=? and SEMANA=?
     `,
      {
        replacements: [maxAno, data.semana],
        type: Sequelize.QueryTypes.SELECT
      }
    );
    const resultTotDistSemana = await Sequelize.query(
      `
        select count( distinct prov.Distrit) as result from iras as i inner join provicional as prov on i.E_SALUD=prov.COD_EST 
        where i.ANO=?  and SEMANA=?;
      `
      ,
      {
        replacements: [maxAno, data.semana],
        type: Sequelize.QueryTypes.SELECT
      }
    )
    const resultTotEstSemana = await Sequelize.query(
      `
        select count( distinct prov.N_EESS) as result from iras as i inner join provicional as prov on i.E_SALUD=prov.COD_EST 
        where i.ANO=?  and SEMANA=?;
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
    console.log("getCasosDistritUltSemServices", annio);

    // Paso 1: Obtener la semana máxima
    const maxSemana = await Iras.max("SEMANA", {
      where: {
        ANO: annio.annio,
      },
    });

    // Paso 2: Consulta principal usando la semana máxima obtenida
    const result = await Iras.findAll({
      attributes: [
        [Sequelize.col("provicional.Dpto"), "Dpto"],
        [Sequelize.col("provicional.Prov"), "Prov"],
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
        ANO: annio.annio,
        SEMANA: maxSemana, // Usamos la semana máxima obtenida
      },
      group: ["provicional.Dpto", "provicional.Prov", "provicional.Distrit"],
    });

    console.log("getCasosDistritUltSemServices:", result);
    return result;
  } catch (error) {
    console.error("Error al obtener el total de registros:", error);
    throw error;
  }
};

const getCasosDistritSemServices = async (data) => {
  try {
    console.log("getCasosDistritSemServices", data);


    // Paso 2: Consulta principal usando la semana máxima obtenida
    const result = await Iras.findAll({
      attributes: [
        [Sequelize.col("provicional.Dpto"), "Dpto"],
        [Sequelize.col("provicional.Prov"), "Prov"],
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
        SEMANA: data.semana, // Usamos la semana máxima obtenida
      },
      group: ["provicional.Dpto", "provicional.Prov", "provicional.Distrit"],
    });

    console.log("getCasosDistritUltSemServices:", result);
    return result;
  } catch (error) {
    console.error("Error al obtener el total de registros:", error);
    throw error;
  }
};

const getgrafico2Services = async (data) => {
  console.log("getTotSemIrasEstService", data);
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
            SELECT MAX(SEMANA) FROM iras where iras.ANO=?
        )
) AS weeks
LEFT JOIN iras ON weeks.num = iras.SEMANA AND iras.E_SALUD =? AND iras.ANO=?
GROUP BY weeks.num 
ORDER BY semana;
    `;

    // Ejecutar la consulta
    studentsWithDetails = await Sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: [data.annio, data.estacion,data.annio],
    });
    console.log("superconsulta:", studentsWithDetails);
    return studentsWithDetails;
  } catch (error) {
    console.error("Error al obtener el total de registros:", error);
    throw error;
  }
};
const getgrafico3Services = async (data) => {
  console.log("getTotSemIrasEstService", data);
  try {
    const query = `
      SELECT 
      SEMANA, 
      COALESCE(SUM(iras.IRA_M2 + iras.IRA_2_11 + iras.IRA_1_4A), 0) AS Total_IRA
      from iras as i inner join provicional as prov on prov.COD_EST=i.E_SALUD
      where prov.Distrit=? and i.ANO=?
    `;

    // Ejecutar la consulta
    studentsWithDetails = await Sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: [data.annio, data.estacion],
    });
    console.log("superconsulta:", studentsWithDetails);
    return studentsWithDetails;
  } catch (error) {
    console.error("Error al obtener el total de registros:", error);
    throw error;
  }
};


const getgrafico4Services = async (data) => {
  console.log("getTotSemIrasEstService", data);
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
                  SELECT MAX(SEMANA) FROM iras where iras.ANO=?
              )
      ) AS weeks
      LEFT JOIN iras ON weeks.num = iras.SEMANA inner join provicional as prov on prov.COD_EST=iras.E_SALUD
      where iras.ANO=? and prov.Distrit=?
      GROUP BY weeks.num 
      ORDER BY semana;
    `;

    // Ejecutar la consulta
    studentsWithDetails = await Sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: [data.annio,data.annio, data.distrito],
    });
    console.log("superconsulta:", studentsWithDetails);
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
};
