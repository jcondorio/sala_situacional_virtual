const Iras = require("../models/irasModel");
const sequelize = require("sequelize"); // Asegúrate de importar Sequelize
const Sequelize = require("../config/db");
const Provicional = require("../models/provicionalModel");
const { Op, fn, col, literal } = require("sequelize");
const jStat = require("jstat");
const math = require("mathjs");

// Importa Provicional si es necesario

const getIrasSemanasServices = async () => {
  //console.log("importDataServices: ");
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
        [Sequelize.literal("SUM(COALESCE(IRA_M2,0) + COALESCE(IRA_2_11,0) + COALESCE(IRA_1_4A,0))"), "Total_IRA"],
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
    //console.log(completeData);
    return completeData;
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir durante la consulta
    console.error("Error al ejecutar la consulta:", error);
    throw error; // Puedes relanzar el error para manejarlo en otro lugar si es necesario
  }
};

const getIrasUltimaSemanaDistrit = async () => {
  //console.log("importDataServices: ");
  try {
    const result = await Iras.findAll({
      attributes: [
        [col("provicional.Dpto"), "Dpto"],
        [col("provicional.Prov"), "Prov"],
        [col("provicional.Distrit"), "Distrit"],
        [fn("SUM", literal("COALESCE(IRA_M2,0) + COALESCE(IRA_2_11,0) + COALESCE(IRA_1_4A,0)")), "total_registros"],
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
          [Op.eq]: literal("(SELECT MAX(SEMANA) FROM iras where ANO= (SELECT MAX(ANO) FROM iras))"),
        },
        ANO: {
          [Op.eq]: literal("(SELECT MAX(ANO) FROM iras)"),

        }
      },
      group: ["provicional.Dpto", "provicional.Prov", "provicional.Distrit"],
    });

    //console.log(result);
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
    const result = await Iras.findOne({
      attributes: [
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("(COALESCE(IRA_M2,0) + COALESCE(IRA_2_11,0) + COALESCE(IRA_1_4A,0))")
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
    const result = await Iras.findOne({
      attributes: [
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("(COALESCE(IRA_M2,0) + COALESCE(IRA_2_11,0) + COALESCE(IRA_1_4A,0))")
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
        [Op.and]: sequelize.literal("(COALESCE(IRA_M2,0) + COALESCE(IRA_2_11,0) + COALESCE(IRA_1_4A,0))> 0"),
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
    //console.log("maxAno: ", maxAno);
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
          [Op.eq]: sequelize.literal(
            `(SELECT MAX(SEMANA) FROM iras WHERE ANO=${maxAno})`
          ),
        },
        [Op.and]: sequelize.literal("(COALESCE(IRA_M2,0) + COALESCE(IRA_2_11,0) + COALESCE(IRA_1_4A,0)) > 0"),
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
      COALESCE(SUM(COALESCE(iras.IRA_M2,0) + COALESCE(iras.IRA_2_11,0) + COALESCE(iras.IRA_1_4A,0)), 0) AS Total_IRA
    
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

    studentsWithDetails = await Sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: [data.id],
    });
    return studentsWithDetails;
  } catch (error) {
    console.error("Error al obtener el total de registros:", error);
    throw error;
  }
};

const getDataDistritService = async () => {
  try {
    const maxAno = await Iras.max("ANO");

    const results = await Sequelize.query(
      `
      SELECT 
          prov.Distrit,
          COALESCE(SUM(COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)), 0) AS casos,
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
      Select sum(COALESCE(IRA_M2,0) + COALESCE(IRA_2_11,0) + COALESCE(IRA_1_4A,0)) as result FROM iras where ANO=?
      `,
      {
        replacements: [maxAno],
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    const resultTotUltimaSemana = await Sequelize.query(
      `
      select sum(COALESCE(IRA_M2,0) + COALESCE(IRA_2_11,0) + COALESCE(IRA_1_4A,0)) as result from iras where ANO=? and SEMANA=(select max(SEMANA) from iras where ANO=?)
     `,
      {
        replacements: [maxAno, maxAno],
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    const resultTotDistSemana = await Sequelize.query(
      `
        select count( distinct prov.Distrit) as result from iras as i inner join provicional as prov on i.E_SALUD=prov.COD_EST 
        where i.ANO=?  and SEMANA=(select max(SEMANA) from iras where ANO=?);
      `,
      {
        replacements: [maxAno, maxAno],
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    const resultTotEstSemana = await Sequelize.query(
      `
        select count( distinct prov.N_EESS) as result from iras as i inner join provicional as prov on i.E_SALUD=prov.COD_EST 
        where i.ANO=?  and SEMANA=(select max(SEMANA) from iras where ANO=?);
      `,
      {
        replacements: [maxAno, maxAno],
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    const cantidadSemanas = await Sequelize.query(
      `
         select max(SEMANA) as result FROM iras where ANO=?;
      `,
      {
        replacements: [maxAno],
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    //console.log("cantidadSemanas", cantidadSemanas);
    //consolidado
    const consolidado = {
      totiras: resultTotIras[0].result,
      totUltSemana: resultTotUltimaSemana[0].result,
      totDistUltSem: resultTotDistSemana[0].result,
      totEstUltSem: resultTotEstSemana[0].result,
      cantidadSemanas: cantidadSemanas[0].result,
    };
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
      select sum(COALESCE(IRA_M2,0) + COALESCE(IRA_2_11,0) + COALESCE(IRA_1_4A,0)) as result from iras where ANO=? and SEMANA=?
     `,
      {
        replacements: [maxAno, data.semana],
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    const resultTotDistSemana = await Sequelize.query(
      `
        select count( distinct prov.Distrit) as result from iras as i inner join provicional as prov on i.E_SALUD=prov.COD_EST 
        where i.ANO=?  and SEMANA=?;
      `,
      {
        replacements: [maxAno, data.semana],
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    const resultTotEstSemana = await Sequelize.query(
      `
        select count( distinct prov.N_EESS) as result from iras as i inner join provicional as prov on i.E_SALUD=prov.COD_EST 
        where i.ANO=?  and SEMANA=?;
      `,
      {
        replacements: [maxAno, data.semana],
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    //consolidado
    const consolidado = {
      totUltSemana: resultTotUltimaSemana[0].result,
      totDistUltSem: resultTotDistSemana[0].result,
      totEstUltSem: resultTotEstSemana[0].result,
    };
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
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal("(COALESCE(IRA_M2,0) + COALESCE(IRA_2_11,0) + COALESCE(IRA_1_4A,0))")
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
    const result = await Iras.findAll({
      attributes: [
        [Sequelize.col("provicional.Dpto"), "Dpto"],
        [Sequelize.col("provicional.Prov"), "Prov"],
        [Sequelize.col("provicional.Distrit"), "Distrit"],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal("(COALESCE(IRA_M2,0) + COALESCE(IRA_2_11,0) + COALESCE(IRA_1_4A,0))")
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
     SELECT weeks.num AS SEMANA, COALESCE(SUM(COALESCE(iras.IRA_M2,0) + COALESCE(iras.IRA_2_11,0) + COALESCE(iras.IRA_1_4A,0)), 0) AS cantidad_registros
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
      replacements: [data.annio, data.estacion, data.annio],
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
      COALESCE(SUM(COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)), 0) AS Total_IRA
      from iras as i inner join provicional as prov on prov.COD_EST=i.E_SALUD
      where prov.Distrit=? and i.ANO=?
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
  //console.log("getTotSemIrasEstService", data);
  try {
    const query = `
      SELECT weeks.num AS SEMANA, COALESCE(SUM(COALESCE(iras.IRA_M2,0) + COALESCE(iras.IRA_2_11,0) + COALESCE(iras.IRA_1_4A,0)), 0) AS cantidad_registros
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
      replacements: [data.annio, data.annio, data.distrito],
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
            select avg(de_ic.logn) as promedio,STDDEV_POP(de_ic.logn) as ln_de, 
      SQRT(count(de_ic.SEMANA)) as ic_inf,SQRT(count(de_ic.SEMANA)) as ic_sup, count(de_ic.SEMANA) as contara ,
      (select sum(pobl.men_5) as poblacion from poblacion as pobl inner join annios_endemicos_iras as iend on iend.nom_annio_endemico=pobl.ano
      where pobl.disa="TACNA" and 
      pobl.ano = (select max(nom_annio_endemico) from annios_endemicos_iras) group by pobl.ano order by pobl.ano) as max_poblacion
      from (
      select
      i.ANO, i.SEMANA, sum(i.IRA_M2+i.IRA_2_11+i.IRA_1_4A) as casos, pobl.poblacion, ((sum(i.IRA_M2+i.IRA_2_11+i.IRA_1_4A)/pobl.poblacion*100000)+1) tasa_i,
      ln(((sum(COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0))/pobl.poblacion*100000)+1)) logn
      from iras as i 
      inner join annios_endemicos_iras iend on i.ANO=iend.nom_annio_endemico
      inner join (select pobl.ano,sum(pobl.men_5) poblacion from poblacion as pobl 
      where pobl.disa="TACNA" group by pobl.ano order by pobl.ano) as pobl on pobl.ano=iend.nom_annio_endemico
      where i.SEMANA<=52 and iend.nom_annio_endemico < ?
      group by i.ANO,i.SEMANA 
      order by i.ANO, i.SEMANA
      ) as de_ic group by de_ic.SEMANA;

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
        zona_exitosa: parseFloat(item.ic_inf_casos.toFixed(2)),
        zona_segura: parseFloat(
          (item.media_casos - item.ic_inf_casos).toFixed(2)
        ),
        zona_alarma: parseFloat(
          (item.ic_sup_casos - item.media_casos).toFixed(2)
        ),
        zona_epidemia: 1200 - (parseFloat(item.ic_inf_casos.toFixed(2)) + parseFloat(
          (item.media_casos - item.ic_inf_casos).toFixed(2)
        ) + parseFloat(
          (item.ic_sup_casos - item.media_casos).toFixed(2)
        )),
      });
    });

    if (bloque_6.length > 0) {
      bloque_6.unshift({
        zona_exitosa: bloque_6[0].zona_exitosa,
        zona_segura: bloque_6[0].zona_segura,
        zona_alarma: bloque_6[0].zona_alarma,
        zona_epidemia: 1200 - bloque_6[0].zona_exitosa - bloque_6[0].zona_segura - bloque_6[0].zona_alarma,
      });
    } else {
      console.error(
        "Error: bloque_6 está vacío, no se puede agregar el elemento inicial."
      );
    }
    console.log(bloque_6);
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
            COALESCE(SUM(COALESCE(iras.IRA_M2,0) + COALESCE(iras.IRA_2_11,0) + COALESCE(iras.IRA_1_4A,0)), 0) AS casos
        FROM weeks
        LEFT JOIN iras 
            ON weeks.SEMANA = iras.SEMANA 
            AND iras.ANO = ?
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
    console.log("distritoonemapService", data);
    const query = `
      SELECT IFNULL(prov.N_EESS, 'Sin nombre') AS N_EESS,
       IFNULL(SUM(COALESCE(i.IRA_M2, 0) + COALESCE(i.IRA_2_11, 0) + COALESCE(i.IRA_1_4A, 0)), 0) AS casos
        FROM provicional AS prov
        LEFT JOIN iras AS i ON i.E_SALUD = prov.COD_EST
          AND i.SEMANA = ?
          AND i.ANO = ?
        WHERE prov.Distrit = ?
        GROUP BY prov.N_EESS
        ORDER BY prov.N_EESS;
  `;
    studentsWithDetails = await Sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: [data.semana, data.annio, data.distrito],
    });
    console.log("distritoonemapService_ress", studentsWithDetails)
    return studentsWithDetails;
  } catch (error) {
    console.error("Error al obtener el total de registros:", error);
    throw error;
  }
};


const getLineBarServices = async () => {
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


const getLineBarEdadIrasServices = async ({ annio }) => {
  try {
    const year = Number(annio);
    const years = {
      before2: year - 2,
      before1: year - 1,
      current: year,
    };

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
        w.SEMANA,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before2 THEN (COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)) AS annio_antes2,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before1 THEN (COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)) AS annio_antes1,
        COALESCE(SUM(CASE WHEN i.ANO = :year_current THEN (COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)) AS annio_actual
      FROM weeks w
      LEFT JOIN iras i
        ON w.SEMANA = i.SEMANA
       AND i.ANO IN (:year_before2, :year_before1, :year_current)
      GROUP BY w.SEMANA
      ORDER BY w.SEMANA;
    `;

    const rows = await Sequelize.query(query, {
      replacements: {
        year_before2: years.before2,
        year_before1: years.before1,
        year_current: years.current,
      },
    });

    const rs = Array.isArray(rows) ? rows[0] ?? rows : rows;

    const result = rs.map(r => ({
      semana: String(r.SEMANA),
      annioantes2: Number(r.annio_antes2) || 0,
      annioantes: Number(r.annio_antes1) || 0,
      annio: Number(r.annio_actual) || 0,
    }));

    return result;
  } catch (error) {
    console.error('Error al obtener el total de registros:', error);
    throw error;
  }
};

const microRedService = async (data) => {
  console.log(data);
  try {
    const result = await Provicional.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('N_Micro_RED')), 'N_Micro_RED']
      ],
      where: {
        N_RED: data.data
      },
      raw: true // devuelve objetos planos {N_Micro_RED: ...}
    });

    // opcional: solo array de strings
    // const microRedes = result.map(r => r.N_Micro_RED);
    // return microRedes;

    return result; // [{N_Micro_RED: '...'}, {N_Micro_RED: '...'}]
  } catch (error) {
    console.error('Error al obtener las micro redes:', error);
    throw error;
  }
};

const EstablecimientosService = async (data) => {
  console.log("revisionde datos:::", data);
  try {
    const result = await Provicional.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('N_EESS')), 'N_EESS']
      ],
      where: {
        N_RED: data.data,
        N_Micro_RED: data.data2,
        Dpto: "TACNA",
      },
      raw: true // devuelve objetos planos {N_Micro_RED: ...}
    });

    // opcional: solo array de strings
    // const microRedes = result.map(r => r.N_Micro_RED);
    // return microRedes;

    return result; // [{N_Micro_RED: '...'}, {N_Micro_RED: '...'}]
  } catch (error) {
    console.error('Error al obtener las micro redes:', error);
    throw error;
  }
};

const ConsultaIrasServices = async (data) => {
  console.log("ConsultaIrasServices", data.annio);
  try {
    if (data.red == "..." && data.indicador == "..." || data.red == "..." && data.indicador == "" || data.red == "" && data.indicador == "..." || data.red == "" && data.indicador == "") {
      const year = Number(data.annio);
      const years = {
        before2: year - 2,
        before1: year - 1,
        current: year,
      };

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
        w.SEMANA,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before2 THEN (COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_antes2,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before1 THEN (COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_antes1,
        COALESCE(SUM(CASE WHEN i.ANO = :year_current THEN (COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_actual
      FROM weeks w
      LEFT JOIN iras i
        ON w.SEMANA = i.SEMANA
       AND i.ANO IN (:year_before2, :year_before1, :year_current)
      GROUP BY w.SEMANA
      ORDER BY w.SEMANA;
    `;

      const rows = await Sequelize.query(query, {
        replacements: {
          year_before2: years.before2,
          year_before1: years.before1,
          year_current: years.current,
        },
      });

      const rs = Array.isArray(rows) ? rows[0] ?? rows : rows;

      const result = rs.map(r => ({
        semana: String(r.SEMANA),
        annioantes2: Number(r.annio_antes2) || 0,
        annioantes: Number(r.annio_antes1) || 0,
        annio: Number(r.annio_actual) || 0,
      }));

      return result;
    }
    else if (data.microred == "..." && data.indicador == "..." || data.microred == "..." && data.indicador == "" || data.microred == "" && data.indicador == "..." || data.microred == "" && data.indicador == "") {
      console.log("data anio:::", data.annio)
      const year = Number(data.annio);
      const years = {
        before2: year - 2,
        before1: year - 1,
        current: year,
      };

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
        w.SEMANA,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before2 THEN (COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_antes2,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before1 THEN (COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_antes1,
        COALESCE(SUM(CASE WHEN i.ANO = :year_current THEN (COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_actual
      FROM weeks w
      LEFT JOIN iras i
        ON w.SEMANA = i.SEMANA
       AND i.ANO IN (:year_before2, :year_before1, :year_current)
      LEFT JOIN provicional p
      ON i.E_SALUD = p.COD_EST   -- ajusta la relación real entre iras y provicional
      WHERE p.N_RED = :redtacna   -- aquí filtras según tu intención
      GROUP BY w.SEMANA
      ORDER BY w.SEMANA;
    `;

      const rows = await Sequelize.query(query, {
        replacements: {
          year_before2: years.before2,
          year_before1: years.before1,
          year_current: years.current,
          redtacna: data.red,
        },
      });

      const rs = Array.isArray(rows) ? rows[0] ?? rows : rows;

      const result = rs.map(r => ({
        semana: String(r.SEMANA),
        annioantes2: Number(r.annio_antes2) || 0,
        annioantes: Number(r.annio_antes1) || 0,
        annio: Number(r.annio_actual) || 0,
      }));

      return result;
    }
    else if (data.establecimiento == "..." && data.indicador == "..." || data.establecimiento == "..." && data.indicador == "" || data.establecimiento == "" && data.indicador == "..." || data.establecimiento == "" && data.indicador == "") {
      const year = Number(data.annio);
      const years = {
        before2: year - 2,
        before1: year - 1,
        current: year,
      };

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
        w.SEMANA,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before2 THEN (COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_antes2,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before1 THEN (COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_antes1,
        COALESCE(SUM(CASE WHEN i.ANO = :year_current THEN (COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_actual
      FROM weeks w
      LEFT JOIN iras i
        ON w.SEMANA = i.SEMANA
       AND i.ANO IN (:year_before2, :year_before1, :year_current)
      LEFT JOIN provicional p
      ON i.E_SALUD = p.COD_EST   
      WHERE p.N_RED = :redtacna and p.N_Micro_RED= :microredtacna
      GROUP BY w.SEMANA
      ORDER BY w.SEMANA;
    `;

      const rows = await Sequelize.query(query, {
        replacements: {
          year_before2: years.before2,
          year_before1: years.before1,
          year_current: years.current,
          redtacna: data.red,
          microredtacna: data.microred
        },
      });

      const rs = Array.isArray(rows) ? rows[0] ?? rows : rows;

      const result = rs.map(r => ({
        semana: String(r.SEMANA),
        annioantes2: Number(r.annio_antes2) || 0,
        annioantes: Number(r.annio_antes1) || 0,
        annio: Number(r.annio_actual) || 0,
      }));

      return result;
    }
    else if (data.red == "..." || data.red == "") {
      if (data.indicador == "IRA_M2") {
        const year = Number(data.annio);
        const years = {
          before2: year - 2,
          before1: year - 1,
          current: year,
        };

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
        w.SEMANA,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before2 THEN (COALESCE(i.IRA_M2,0)) ELSE 0 END), 0) AS annio_antes2,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before1 THEN (COALESCE(i.IRA_M2,0)) ELSE 0 END), 0) AS annio_antes1,
        COALESCE(SUM(CASE WHEN i.ANO = :year_current THEN (COALESCE(i.IRA_M2,0)) ELSE 0 END), 0) AS annio_actual
      FROM weeks w
      LEFT JOIN iras i
        ON w.SEMANA = i.SEMANA
       AND i.ANO IN (:year_before2, :year_before1, :year_current)
      GROUP BY w.SEMANA
      ORDER BY w.SEMANA;
    `;

        const rows = await Sequelize.query(query, {
          replacements: {
            year_before2: years.before2,
            year_before1: years.before1,
            year_current: years.current,
          },
        });

        const rs = Array.isArray(rows) ? rows[0] ?? rows : rows;

        const result = rs.map(r => ({
          semana: String(r.SEMANA),
          annioantes2: Number(r.annio_antes2) || 0,
          annioantes: Number(r.annio_antes1) || 0,
          annio: Number(r.annio_actual) || 0,
        }));

        return result;
      }
      else if (data.indicador == "IRA_2_11") {
        const year = Number(data.annio);
        const years = {
          before2: year - 2,
          before1: year - 1,
          current: year,
        };

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
        w.SEMANA,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before2 THEN (COALESCE(i.IRA_2_11,0)) ELSE 0 END), 0) AS annio_antes2,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before1 THEN (COALESCE(i.IRA_2_11,0)) ELSE 0 END), 0) AS annio_antes1,
        COALESCE(SUM(CASE WHEN i.ANO = :year_current THEN (COALESCE(i.IRA_2_11,0)) ELSE 0 END), 0) AS annio_actual
      FROM weeks w
      LEFT JOIN iras i
        ON w.SEMANA = i.SEMANA
       AND i.ANO IN (:year_before2, :year_before1, :year_current)
      GROUP BY w.SEMANA
      ORDER BY w.SEMANA;
    `;

        const rows = await Sequelize.query(query, {
          replacements: {
            year_before2: years.before2,
            year_before1: years.before1,
            year_current: years.current,
          },
        });

        const rs = Array.isArray(rows) ? rows[0] ?? rows : rows;

        const result = rs.map(r => ({
          semana: String(r.SEMANA),
          annioantes2: Number(r.annio_antes2) || 0,
          annioantes: Number(r.annio_antes1) || 0,
          annio: Number(r.annio_actual) || 0,
        }));

        return result;
      }
      else if (data.indicador == "IRA_1_4A") {
        const year = Number(data.annio);
        const years = {
          before2: year - 2,
          before1: year - 1,
          current: year,
        };

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
        w.SEMANA,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before2 THEN (COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_antes2,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before1 THEN (COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_antes1,
        COALESCE(SUM(CASE WHEN i.ANO = :year_current THEN (COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_actual
      FROM weeks w
      LEFT JOIN iras i
        ON w.SEMANA = i.SEMANA
       AND i.ANO IN (:year_before2, :year_before1, :year_current)
      GROUP BY w.SEMANA
      ORDER BY w.SEMANA;
    `;

        const rows = await Sequelize.query(query, {
          replacements: {
            year_before2: years.before2,
            year_before1: years.before1,
            year_current: years.current,
          },
        });

        const rs = Array.isArray(rows) ? rows[0] ?? rows : rows;

        const result = rs.map(r => ({
          semana: String(r.SEMANA),
          annioantes2: Number(r.annio_antes2) || 0,
          annioantes: Number(r.annio_antes1) || 0,
          annio: Number(r.annio_actual) || 0,
        }));

        return result;
      }
      else if (data.indicador == "<5A") {
        const year = Number(data.annio);
        const years = {
          before2: year - 2,
          before1: year - 1,
          current: year,
        };

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
        w.SEMANA,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before2 THEN (COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_antes2,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before1 THEN (COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_antes1,
        COALESCE(SUM(CASE WHEN i.ANO = :year_current THEN (COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_actual
      FROM weeks w
      LEFT JOIN iras i
        ON w.SEMANA = i.SEMANA
       AND i.ANO IN (:year_before2, :year_before1, :year_current)
      GROUP BY w.SEMANA
      ORDER BY w.SEMANA;
    `;

        const rows = await Sequelize.query(query, {
          replacements: {
            year_before2: years.before2,
            year_before1: years.before1,
            year_current: years.current,
          },
        });

        const rs = Array.isArray(rows) ? rows[0] ?? rows : rows;

        const result = rs.map(r => ({
          semana: String(r.SEMANA),
          annioantes2: Number(r.annio_antes2) || 0,
          annioantes: Number(r.annio_antes1) || 0,
          annio: Number(r.annio_actual) || 0,
        }));

        return result;
      }
      else {

      }

    }
    else if (data.microred == "..." || data.microred == "") {
      if (data.indicador == "IRA_M2") {
        const year = Number(data.annio);
        const years = {
          before2: year - 2,
          before1: year - 1,
          current: year,
        };

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
        w.SEMANA,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before2 THEN (COALESCE(i.IRA_M2,0) ) ELSE 0 END), 0) AS annio_antes2,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before1 THEN (COALESCE(i.IRA_M2,0) ) ELSE 0 END), 0) AS annio_antes1,
        COALESCE(SUM(CASE WHEN i.ANO = :year_current THEN (COALESCE(i.IRA_M2,0) ) ELSE 0 END), 0) AS annio_actual
      FROM weeks w
      LEFT JOIN iras i
        ON w.SEMANA = i.SEMANA
       AND i.ANO IN (:year_before2, :year_before1, :year_current)
      LEFT JOIN provicional p
      ON i.E_SALUD = p.COD_EST   -- ajusta la relación real entre iras y provicional
      WHERE p.N_RED = :redtacna   -- aquí filtras según tu intención
      GROUP BY w.SEMANA
      ORDER BY w.SEMANA;
    `;

        const rows = await Sequelize.query(query, {
          replacements: {
            year_before2: years.before2,
            year_before1: years.before1,
            year_current: years.current,
            redtacna: data.red,
          },
        });

        const rs = Array.isArray(rows) ? rows[0] ?? rows : rows;

        const result = rs.map(r => ({
          semana: String(r.SEMANA),
          annioantes2: Number(r.annio_antes2) || 0,
          annioantes: Number(r.annio_antes1) || 0,
          annio: Number(r.annio_actual) || 0,
        }));

        return result;
      }
      else if (data.indicador == "IRA_2_11") {
        const year = Number(data.annio);
        const years = {
          before2: year - 2,
          before1: year - 1,
          current: year,
        };

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
        w.SEMANA,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before2 THEN (COALESCE(i.IRA_2_11,0) ) ELSE 0 END), 0) AS annio_antes2,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before1 THEN (COALESCE(i.IRA_2_11,0)) ELSE 0 END), 0) AS annio_antes1,
        COALESCE(SUM(CASE WHEN i.ANO = :year_current THEN (COALESCE(i.IRA_2_11,0) ) ELSE 0 END), 0) AS annio_actual
      FROM weeks w
      LEFT JOIN iras i
        ON w.SEMANA = i.SEMANA
       AND i.ANO IN (:year_before2, :year_before1, :year_current)
      LEFT JOIN provicional p
      ON i.E_SALUD = p.COD_EST   -- ajusta la relación real entre iras y provicional
      WHERE p.N_RED = :redtacna   -- aquí filtras según tu intención
      GROUP BY w.SEMANA
      ORDER BY w.SEMANA;
    `;

        const rows = await Sequelize.query(query, {
          replacements: {
            year_before2: years.before2,
            year_before1: years.before1,
            year_current: years.current,
            redtacna: data.red,
          },
        });

        const rs = Array.isArray(rows) ? rows[0] ?? rows : rows;

        const result = rs.map(r => ({
          semana: String(r.SEMANA),
          annioantes2: Number(r.annio_antes2) || 0,
          annioantes: Number(r.annio_antes1) || 0,
          annio: Number(r.annio_actual) || 0,
        }));

        return result;
      }
      else if (data.indicador == "IRA_1_4A") {
        const year = Number(data.annio);
        const years = {
          before2: year - 2,
          before1: year - 1,
          current: year,
        };

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
        w.SEMANA,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before2 THEN (COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_antes2,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before1 THEN (COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_antes1,
        COALESCE(SUM(CASE WHEN i.ANO = :year_current THEN (COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_actual
      FROM weeks w
      LEFT JOIN iras i
        ON w.SEMANA = i.SEMANA
       AND i.ANO IN (:year_before2, :year_before1, :year_current)
      LEFT JOIN provicional p
      ON i.E_SALUD = p.COD_EST   -- ajusta la relación real entre iras y provicional
      WHERE p.N_RED = :redtacna   -- aquí filtras según tu intención
      GROUP BY w.SEMANA
      ORDER BY w.SEMANA;
    `;

        const rows = await Sequelize.query(query, {
          replacements: {
            year_before2: years.before2,
            year_before1: years.before1,
            year_current: years.current,
            redtacna: data.red,
          },
        });

        const rs = Array.isArray(rows) ? rows[0] ?? rows : rows;

        const result = rs.map(r => ({
          semana: String(r.SEMANA),
          annioantes2: Number(r.annio_antes2) || 0,
          annioantes: Number(r.annio_antes1) || 0,
          annio: Number(r.annio_actual) || 0,
        }));

        return result;
      }
      else if (data.indicador == "<5A") {
        const year = Number(data.annio);
        const years = {
          before2: year - 2,
          before1: year - 1,
          current: year,
        };

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
        w.SEMANA,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before2 THEN (COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_antes2,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before1 THEN (COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_antes1,
        COALESCE(SUM(CASE WHEN i.ANO = :year_current THEN (COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_actual
      FROM weeks w
      LEFT JOIN iras i
        ON w.SEMANA = i.SEMANA
       AND i.ANO IN (:year_before2, :year_before1, :year_current)
      LEFT JOIN provicional p
      ON i.E_SALUD = p.COD_EST   -- ajusta la relación real entre iras y provicional
      WHERE p.N_RED = :redtacna   -- aquí filtras según tu intención
      GROUP BY w.SEMANA
      ORDER BY w.SEMANA;
    `;

        const rows = await Sequelize.query(query, {
          replacements: {
            year_before2: years.before2,
            year_before1: years.before1,
            year_current: years.current,
            redtacna: data.red,
          },
        });

        const rs = Array.isArray(rows) ? rows[0] ?? rows : rows;

        const result = rs.map(r => ({
          semana: String(r.SEMANA),
          annioantes2: Number(r.annio_antes2) || 0,
          annioantes: Number(r.annio_antes1) || 0,
          annio: Number(r.annio_actual) || 0,
        }));

        return result;
      }
      else {
console.log("paso por aqui o no")
      }
    }
    else if (data.establecimiento == "..." || data.establecimiento == "") {
      if (data.indicador == "IRA_M2") {
        const year = Number(data.annio);
        const years = {
          before2: year - 2,
          before1: year - 1,
          current: year,
        };

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
        w.SEMANA,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before2 THEN (COALESCE(i.IRA_M2,0) ) ELSE 0 END), 0) AS annio_antes2,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before1 THEN (COALESCE(i.IRA_M2,0) ) ELSE 0 END), 0) AS annio_antes1,
        COALESCE(SUM(CASE WHEN i.ANO = :year_current THEN (COALESCE(i.IRA_M2,0) ) ELSE 0 END), 0) AS annio_actual
      FROM weeks w
      LEFT JOIN iras i
        ON w.SEMANA = i.SEMANA
       AND i.ANO IN (:year_before2, :year_before1, :year_current)
      LEFT JOIN provicional p
      ON i.E_SALUD = p.COD_EST   
      WHERE p.N_RED = :redtacna and p.N_Micro_RED= :microredtacna
      GROUP BY w.SEMANA
      ORDER BY w.SEMANA;
    `;

        const rows = await Sequelize.query(query, {
          replacements: {
            year_before2: years.before2,
            year_before1: years.before1,
            year_current: years.current,
            redtacna: data.red,
            microredtacna: data.microred
          },
        });

        const rs = Array.isArray(rows) ? rows[0] ?? rows : rows;

        const result = rs.map(r => ({
          semana: String(r.SEMANA),
          annioantes2: Number(r.annio_antes2) || 0,
          annioantes: Number(r.annio_antes1) || 0,
          annio: Number(r.annio_actual) || 0,
        }));

        return result;
      }
      else if (data.indicador == "IRA_2_11") {
        const year = Number(data.annio);
        const years = {
          before2: year - 2,
          before1: year - 1,
          current: year,
        };

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
        w.SEMANA,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before2 THEN ( COALESCE(i.IRA_2_11,0) ) ELSE 0 END), 0) AS annio_antes2,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before1 THEN ( COALESCE(i.IRA_2_11,0) ) ELSE 0 END), 0) AS annio_antes1,
        COALESCE(SUM(CASE WHEN i.ANO = :year_current THEN (COALESCE(i.IRA_2_11,0) ) ELSE 0 END), 0) AS annio_actual
      FROM weeks w
      LEFT JOIN iras i
        ON w.SEMANA = i.SEMANA
       AND i.ANO IN (:year_before2, :year_before1, :year_current)
      LEFT JOIN provicional p
      ON i.E_SALUD = p.COD_EST   
      WHERE p.N_RED = :redtacna and p.N_Micro_RED= :microredtacna
      GROUP BY w.SEMANA
      ORDER BY w.SEMANA;
    `;

        const rows = await Sequelize.query(query, {
          replacements: {
            year_before2: years.before2,
            year_before1: years.before1,
            year_current: years.current,
            redtacna: data.red,
            microredtacna: data.microred
          },
        });

        const rs = Array.isArray(rows) ? rows[0] ?? rows : rows;

        const result = rs.map(r => ({
          semana: String(r.SEMANA),
          annioantes2: Number(r.annio_antes2) || 0,
          annioantes: Number(r.annio_antes1) || 0,
          annio: Number(r.annio_actual) || 0,
        }));

        return result;
      }
      else if (data.indicador == "IRA_1_4A") {
        const year = Number(data.annio);
        const years = {
          before2: year - 2,
          before1: year - 1,
          current: year,
        };

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
        w.SEMANA,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before2 THEN (COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_antes2,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before1 THEN (COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_antes1,
        COALESCE(SUM(CASE WHEN i.ANO = :year_current THEN (COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_actual
      FROM weeks w
      LEFT JOIN iras i
        ON w.SEMANA = i.SEMANA
       AND i.ANO IN (:year_before2, :year_before1, :year_current)
      LEFT JOIN provicional p
      ON i.E_SALUD = p.COD_EST   
      WHERE p.N_RED = :redtacna and p.N_Micro_RED= :microredtacna
      GROUP BY w.SEMANA
      ORDER BY w.SEMANA;
    `;

        const rows = await Sequelize.query(query, {
          replacements: {
            year_before2: years.before2,
            year_before1: years.before1,
            year_current: years.current,
            redtacna: data.red,
            microredtacna: data.microred
          },
        });

        const rs = Array.isArray(rows) ? rows[0] ?? rows : rows;

        const result = rs.map(r => ({
          semana: String(r.SEMANA),
          annioantes2: Number(r.annio_antes2) || 0,
          annioantes: Number(r.annio_antes1) || 0,
          annio: Number(r.annio_actual) || 0,
        }));

        return result;
      }
      else if (data.indicador == "<5A") {
        const year = Number(data.annio);
        const years = {
          before2: year - 2,
          before1: year - 1,
          current: year,
        };

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
        w.SEMANA,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before2 THEN (COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_antes2,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before1 THEN (COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_antes1,
        COALESCE(SUM(CASE WHEN i.ANO = :year_current THEN (COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_actual
      FROM weeks w
      LEFT JOIN iras i
        ON w.SEMANA = i.SEMANA
       AND i.ANO IN (:year_before2, :year_before1, :year_current)
      LEFT JOIN provicional p
      ON i.E_SALUD = p.COD_EST   
      WHERE p.N_RED = :redtacna and p.N_Micro_RED= :microredtacna
      GROUP BY w.SEMANA
      ORDER BY w.SEMANA;
    `;

        const rows = await Sequelize.query(query, {
          replacements: {
            year_before2: years.before2,
            year_before1: years.before1,
            year_current: years.current,
            redtacna: data.red,
            microredtacna: data.microred
          },
        });

        const rs = Array.isArray(rows) ? rows[0] ?? rows : rows;

        const result = rs.map(r => ({
          semana: String(r.SEMANA),
          annioantes2: Number(r.annio_antes2) || 0,
          annioantes: Number(r.annio_antes1) || 0,
          annio: Number(r.annio_actual) || 0,
        }));

        return result;
      }
      else {
        if (data.indicador == "IRA_M2") {
          const year = Number(data.annio);
          const years = {
            before2: year - 2,
            before1: year - 1,
            current: year,
          };

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
        w.SEMANA,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before2 THEN (COALESCE(i.IRA_M2,0) ) ELSE 0 END), 0) AS annio_antes2,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before1 THEN (COALESCE(i.IRA_M2,0) ) ELSE 0 END), 0) AS annio_antes1,
        COALESCE(SUM(CASE WHEN i.ANO = :year_current THEN (COALESCE(i.IRA_M2,0) ) ELSE 0 END), 0) AS annio_actual
      FROM weeks w
      LEFT JOIN iras i
        ON w.SEMANA = i.SEMANA
       AND i.ANO IN (:year_before2, :year_before1, :year_current)
      LEFT JOIN provicional p
      ON i.E_SALUD = p.COD_EST   
      WHERE p.N_RED = :redtacna and p.N_Micro_RED= :microredtacna and p.N_EESS=:establecimiento
      GROUP BY w.SEMANA
      ORDER BY w.SEMANA;
    `;

          const rows = await Sequelize.query(query, {
            replacements: {
              year_before2: years.before2,
              year_before1: years.before1,
              year_current: years.current,
              redtacna: data.red,
              microredtacna: data.microred,
              establecimiento: data.establecimiento,
            },
          });

          const rs = Array.isArray(rows) ? rows[0] ?? rows : rows;

          const result = rs.map(r => ({
            semana: String(r.SEMANA),
            annioantes2: Number(r.annio_antes2) || 0,
            annioantes: Number(r.annio_antes1) || 0,
            annio: Number(r.annio_actual) || 0,
          }));

          return result;
        }
        else if (data.indicador == "IRA_2_11") {
          const year = Number(data.annio);
          const years = {
            before2: year - 2,
            before1: year - 1,
            current: year,
          };

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
        w.SEMANA,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before2 THEN ( COALESCE(i.IRA_2_11,0) ) ELSE 0 END), 0) AS annio_antes2,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before1 THEN ( COALESCE(i.IRA_2_11 ,0)) ELSE 0 END), 0) AS annio_antes1,
        COALESCE(SUM(CASE WHEN i.ANO = :year_current THEN (COALESCE(i.IRA_2_11 ,0)) ELSE 0 END), 0) AS annio_actual
      FROM weeks w
      LEFT JOIN iras i
        ON w.SEMANA = i.SEMANA
       AND i.ANO IN (:year_before2, :year_before1, :year_current)
      LEFT JOIN provicional p
      ON i.E_SALUD = p.COD_EST   
      WHERE p.N_RED = :redtacna and p.N_Micro_RED= :microredtacna and p.N_EESS=:establecimiento
      GROUP BY w.SEMANA
      ORDER BY w.SEMANA;
    `;

          const rows = await Sequelize.query(query, {
            replacements: {
              year_before2: years.before2,
              year_before1: years.before1,
              year_current: years.current,
              redtacna: data.red,
              microredtacna: data.microred,
              establecimiento: data.establecimiento,

            },
          });

          const rs = Array.isArray(rows) ? rows[0] ?? rows : rows;

          const result = rs.map(r => ({
            semana: String(r.SEMANA),
            annioantes2: Number(r.annio_antes2) || 0,
            annioantes: Number(r.annio_antes1) || 0,
            annio: Number(r.annio_actual) || 0,
          }));

          return result;
        }
        else if (data.indicador == "IRA_1_4A") {
          const year = Number(data.annio);
          const years = {
            before2: year - 2,
            before1: year - 1,
            current: year,
          };

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
        w.SEMANA,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before2 THEN (COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_antes2,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before1 THEN (COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_antes1,
        COALESCE(SUM(CASE WHEN i.ANO = :year_current THEN (COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_actual
      FROM weeks w
      LEFT JOIN iras i
        ON w.SEMANA = i.SEMANA
       AND i.ANO IN (:year_before2, :year_before1, :year_current)
      LEFT JOIN provicional p
      ON i.E_SALUD = p.COD_EST   
      WHERE p.N_RED = :redtacna and p.N_Micro_RED= :microredtacna and p.N_EESS=:establecimiento
      GROUP BY w.SEMANA
      ORDER BY w.SEMANA;
    `;

          const rows = await Sequelize.query(query, {
            replacements: {
              year_before2: years.before2,
              year_before1: years.before1,
              year_current: years.current,
              redtacna: data.red,
              microredtacna: data.microred,
              establecimiento: data.establecimiento,

            },
          });

          const rs = Array.isArray(rows) ? rows[0] ?? rows : rows;

          const result = rs.map(r => ({
            semana: String(r.SEMANA),
            annioantes2: Number(r.annio_antes2) || 0,
            annioantes: Number(r.annio_antes1) || 0,
            annio: Number(r.annio_actual) || 0,
          }));

          return result;
        }
        else if (data.indicador == "<5A") {
          const year = Number(data.annio);
          const years = {
            before2: year - 2,
            before1: year - 1,
            current: year,
          };

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
        w.SEMANA,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before2 THEN (COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_antes2,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before1 THEN (COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_antes1,
        COALESCE(SUM(CASE WHEN i.ANO = :year_current THEN (COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_actual
      FROM weeks w
      LEFT JOIN iras i
        ON w.SEMANA = i.SEMANA
       AND i.ANO IN (:year_before2, :year_before1, :year_current)
      LEFT JOIN provicional p
      ON i.E_SALUD = p.COD_EST   
      WHERE p.N_RED = :redtacna and p.N_Micro_RED= :microredtacna and p.N_EESS=:establecimiento
      GROUP BY w.SEMANA
      ORDER BY w.SEMANA;
    `;

          const rows = await Sequelize.query(query, {
            replacements: {
              year_before2: years.before2,
              year_before1: years.before1,
              year_current: years.current,
              redtacna: data.red,
              microredtacna: data.microred,
              establecimiento: data.establecimiento,

            },
          });

          const rs = Array.isArray(rows) ? rows[0] ?? rows : rows;

          const result = rs.map(r => ({
            semana: String(r.SEMANA),
            annioantes2: Number(r.annio_antes2) || 0,
            annioantes: Number(r.annio_antes1) || 0,
            annio: Number(r.annio_actual) || 0,
          }));

          return result;
        }
      }
    }
    else {
      console.log("esta aqui en el ultimo else")
       if (data.indicador == "IRA_M2") {
          const year = Number(data.annio);
          const years = {
            before2: year - 2,
            before1: year - 1,
            current: year,
          };

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
        w.SEMANA,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before2 THEN (COALESCE(i.IRA_M2,0) ) ELSE 0 END), 0) AS annio_antes2,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before1 THEN (COALESCE(i.IRA_M2,0) ) ELSE 0 END), 0) AS annio_antes1,
        COALESCE(SUM(CASE WHEN i.ANO = :year_current THEN (COALESCE(i.IRA_M2,0) ) ELSE 0 END), 0) AS annio_actual
      FROM weeks w
      LEFT JOIN iras i
        ON w.SEMANA = i.SEMANA
       AND i.ANO IN (:year_before2, :year_before1, :year_current)
      LEFT JOIN provicional p
      ON i.E_SALUD = p.COD_EST   
      WHERE p.N_RED = :redtacna and p.N_Micro_RED= :microredtacna and p.N_EESS=:establecimiento
      GROUP BY w.SEMANA
      ORDER BY w.SEMANA;
    `;

          const rows = await Sequelize.query(query, {
            replacements: {
              year_before2: years.before2,
              year_before1: years.before1,
              year_current: years.current,
              redtacna: data.red,
              microredtacna: data.microred,
              establecimiento: data.establecimiento,
            },
          });

          const rs = Array.isArray(rows) ? rows[0] ?? rows : rows;

          const result = rs.map(r => ({
            semana: String(r.SEMANA),
            annioantes2: Number(r.annio_antes2) || 0,
            annioantes: Number(r.annio_antes1) || 0,
            annio: Number(r.annio_actual) || 0,
          }));

          return result;
        }
        else if (data.indicador == "IRA_2_11") {
          const year = Number(data.annio);
          const years = {
            before2: year - 2,
            before1: year - 1,
            current: year,
          };

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
        w.SEMANA,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before2 THEN ( COALESCE(i.IRA_2_11,0) ) ELSE 0 END), 0) AS annio_antes2,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before1 THEN ( COALESCE(i.IRA_2_11,0)) ELSE 0 END), 0) AS annio_antes1,
        COALESCE(SUM(CASE WHEN i.ANO = :year_current THEN (COALESCE(i.IRA_2_11,0) ) ELSE 0 END), 0) AS annio_actual
      FROM weeks w
      LEFT JOIN iras i
        ON w.SEMANA = i.SEMANA
       AND i.ANO IN (:year_before2, :year_before1, :year_current)
      LEFT JOIN provicional p
      ON i.E_SALUD = p.COD_EST   
      WHERE p.N_RED = :redtacna and p.N_Micro_RED= :microredtacna and p.N_EESS=:establecimiento
      GROUP BY w.SEMANA
      ORDER BY w.SEMANA;
    `;

          const rows = await Sequelize.query(query, {
            replacements: {
              year_before2: years.before2,
              year_before1: years.before1,
              year_current: years.current,
              redtacna: data.red,
              microredtacna: data.microred,
              establecimiento: data.establecimiento,

            },
          });

          const rs = Array.isArray(rows) ? rows[0] ?? rows : rows;

          const result = rs.map(r => ({
            semana: String(r.SEMANA),
            annioantes2: Number(r.annio_antes2) || 0,
            annioantes: Number(r.annio_antes1) || 0,
            annio: Number(r.annio_actual) || 0,
          }));
console.log(result)
          return result;
        }
        else if (data.indicador == "IRA_1_4A") {
          const year = Number(data.annio);
          const years = {
            before2: year - 2,
            before1: year - 1,
            current: year,
          };

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
        w.SEMANA,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before2 THEN (COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_antes2,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before1 THEN (COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_antes1,
        COALESCE(SUM(CASE WHEN i.ANO = :year_current THEN (COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_actual
      FROM weeks w
      LEFT JOIN iras i
        ON w.SEMANA = i.SEMANA
       AND i.ANO IN (:year_before2, :year_before1, :year_current)
      LEFT JOIN provicional p
      ON i.E_SALUD = p.COD_EST   
      WHERE p.N_RED = :redtacna and p.N_Micro_RED= :microredtacna and p.N_EESS=:establecimiento
      GROUP BY w.SEMANA
      ORDER BY w.SEMANA;
    `;

          const rows = await Sequelize.query(query, {
            replacements: {
              year_before2: years.before2,
              year_before1: years.before1,
              year_current: years.current,
              redtacna: data.red,
              microredtacna: data.microred,
              establecimiento: data.establecimiento,

            },
          });

          const rs = Array.isArray(rows) ? rows[0] ?? rows : rows;

          const result = rs.map(r => ({
            semana: String(r.SEMANA),
            annioantes2: Number(r.annio_antes2) || 0,
            annioantes: Number(r.annio_antes1) || 0,
            annio: Number(r.annio_actual) || 0,
          }));

          return result;
        }
        else if (data.indicador == "<5A") {
          const year = Number(data.annio);
          const years = {
            before2: year - 2,
            before1: year - 1,
            current: year,
          };

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
        w.SEMANA,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before2 THEN (COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_antes2,
        COALESCE(SUM(CASE WHEN i.ANO = :year_before1 THEN (COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_antes1,
        COALESCE(SUM(CASE WHEN i.ANO = :year_current THEN (COALESCE(i.IRA_M2,0) + COALESCE(i.IRA_2_11,0) + COALESCE(i.IRA_1_4A,0)) ELSE 0 END), 0) AS annio_actual
      FROM weeks w
      LEFT JOIN iras i
        ON w.SEMANA = i.SEMANA
       AND i.ANO IN (:year_before2, :year_before1, :year_current)
      LEFT JOIN provicional p
      ON i.E_SALUD = p.COD_EST   
      WHERE p.N_RED = :redtacna and p.N_Micro_RED= :microredtacna and p.N_EESS=:establecimiento
      GROUP BY w.SEMANA
      ORDER BY w.SEMANA;
    `;

          const rows = await Sequelize.query(query, {
            replacements: {
              year_before2: years.before2,
              year_before1: years.before1,
              year_current: years.current,
              redtacna: data.red,
              microredtacna: data.microred,
              establecimiento: data.establecimiento,

            },
          });

          const rs = Array.isArray(rows) ? rows[0] ?? rows : rows;

          const result = rs.map(r => ({
            semana: String(r.SEMANA),
            annioantes2: Number(r.annio_antes2) || 0,
            annioantes: Number(r.annio_antes1) || 0,
            annio: Number(r.annio_actual) || 0,
          }));

          return result;
        }
    }
  } catch (error) {
    console.error('Error al obtener las micro redes:', error);
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
  getLineBarServices,
  getLineBarEdadIrasServices,
  microRedService,
  EstablecimientosService,
  ConsultaIrasServices,
};
