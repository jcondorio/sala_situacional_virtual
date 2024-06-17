
const Iras = require("../models/irasModel.js");
const Departamento = require("../models/departamentoModel.js");
const Diresa = require("../models/diresaModel.js");
const Provincia = require("../models/provinciaModel.js");
const Distrito = require("../models/distritoModel.js");
const Red = require("../models/redModel.js");
const Localidad = require("../models/localidadModel.js");
const Microred = require("../models/microredModel.js");
const Establecimiento = require("../models/establecimientoModel.js");
const Provicional = require("../models/provicionalModel.js");
const Edas = require("../models/edasModel.js");

// Función para eliminar los registros por año
const deleteIrasRecordsByYear = async (year) => {
  try {
    await Iras.destroy({
      where: {
        ANO: year
      }
    });
    console.log(`Registros del año ${year} eliminados correctamente.`);
  } catch (error) {
    console.error('Error eliminando registros:', error);
    throw error;
  }
};

const importDataServices = async (data, blockSize = 10) => {
  console.log("importDataServices: ");
  try {
    const year = data[0].ANO; // Se asume que todos los registros tienen el mismo año
    await deleteIrasRecordsByYear(year); // Elimina los registros del año específico

    const totalRecords = data.length;
    let insertedCount = 0;

    while (insertedCount < totalRecords) {
      const block = data.slice(insertedCount, insertedCount + blockSize);
      await Promise.all(block.map(async (rowData) => {
        try {
          const idValue = rowData.ID === "" ? null : rowData.ID;
          const anoValue = rowData.ANO === "" ? null : rowData.ANO;
          const semanaValue = rowData.SEMANA === "" ? null : rowData.SEMANA;
          const subregValue = rowData.SUB_REG_NT === "" ? null : rowData.SUB_REG_NT;
          const redValue = rowData.RED === "" ? null : rowData.RED;
          const microredValue = rowData.MICRORED === "" ? null : rowData.MICRORED;
          const esaludValue = rowData.E_SALUD === "" ? null : rowData.E_SALUD;
          const ubigeoValue = rowData.UBIGEO === "" ? null : rowData.UBIGEO;
          const iram2Value = rowData.IRA_M2 === "" ? null : rowData.IRA_M2;
          const ira211mValue = rowData.IRA_2_11 === "" ? null : rowData.IRA_2_11;
          const ira14aCValue = rowData.IRA_1_4A === "" ? null : rowData.IRA_1_4A;
          const neu211Value = rowData.NEU_2_11 === "" ? null : rowData.NEU_2_11;
          const neu14aValue = rowData.NEU_1_4A === "" ? null : rowData.NEU_1_4A;
          const neu59aValue = rowData.NEU_5_9A === "" ? null : rowData.NEU_5_9A;
          const neu1019Value = rowData.NEU_10_19 === "" ? null : rowData.NEU_10_19;
          const neu2059Value = rowData.NEU_20_59 === "" ? null : rowData.NEU_20_59;
          const neu60aValue = rowData.NEU_60A === "" ? null : rowData.NEU_60A;
          const hosm2Value = rowData.HOS_M2 === "" ? null : rowData.HOS_M2;
          const hos211Value = rowData.HOS_2_11 === "" ? null : rowData.HOS_2_11;
          const hos14aValue = rowData.HOS_1_4A === "" ? null : rowData.HOS_1_4A;
          const hos59aValue = rowData.HOS_5_9A === "" ? null : rowData.HOS_5_9A;
          const hos1019Value = rowData.HOS_10_19 === "" ? null : rowData.HOS_10_19;
          const hos2059Value = rowData.HOS_20_59 === "" ? null : rowData.HOS_20_59;
          const hos60aValue = rowData.HOS_60A === "" ? null : rowData.HOS_60A;
          const ngrm2Value = rowData.NGR_M2 === "" ? null : rowData.NGR_M2;
          const ngr211Value = rowData.NGR_2_11 === "" ? null : rowData.NGR_2_11;
          const nrg14aValue = rowData.NGR_1_4A === "" ? null : rowData.NGR_1_4A;
          const ngr59aValue = rowData.NGR_5_9A === "" ? null : rowData.NGR_5_9A;
          const ngr60aValue = rowData.NGR_60A === "" ? null : rowData.NGR_60A;
          const dih2mValue = rowData.DIH_M2 === "" ? null : rowData.DIH_M2;
          const dih211mValue = rowData.DIH_2_11 === "" ? null : rowData.DIH_2_11;
          const dih14aValue = rowData.DIH_1_4A === "" ? null : rowData.DIH_1_4A;
          const dih59aValue = rowData.DIH_5_9A === "" ? null : rowData.DIH_5_9A;
          const dih1019aValue = rowData.DIH_10_19 === "" ? null : rowData.DIH_10_19;
          const dih2059aValue = rowData.DIH_20_59 === "" ? null : rowData.DIH_20_59;
          const dih60aValue = rowData.DIH_60A === "" ? null : rowData.DIH_60A;
          const deh2mValue = rowData.DEH_M2 === "" ? null : rowData.DEH_M2;
          const deh211mValue = rowData.DEH_2_11 === "" ? null : rowData.DEH_2_11;
          const deh14aValue = rowData.DEH_1_4A === "" ? null : rowData.DEH_1_4A;
          const deh59aValue = rowData.DEH_5_9A === "" ? null : rowData.DEH_5_9A;
          const deh1019aValue = rowData.DEH_10_19 === "" ? null : rowData.DEH_10_19;
          const deh2059aValue = rowData.DEH_20_59 === "" ? null : rowData.DEH_20_59;
          const deh60aValue = rowData.DEH_60A === "" ? null : rowData.DEH_60A;
          const sob2aValue = rowData.SOB_2A === "" ? null : rowData.SOB_2A;
          const sob24aValue = rowData.SOB_2_4A === "" ? null : rowData.SOB_2_4A;
          const sob59Value = rowData.SOB_5_9A === "" ? null : rowData.SOB_5_9A;
          const sob1019aValue = rowData.SOB_10_19A === "" ? null : rowData.SOB_10_19A;
          const sob2059aValue = rowData.SOB_20_59A === "" ? null : rowData.SOB_20_59A;
          const fechaingValue = rowData.FECHA_ING === "" ? null : rowData.FECHA_ING;
          const etniaprocValue = rowData.ETNIAPROC === "" ? null : rowData.ETNIAPROC;
          const etniasValue = rowData.ETNIAS === "" ? null : rowData.ETNIAS;
          const procedeValue = rowData.PROCEDE === "" ? null : rowData.PROCEDE;
          const otroprocValue = rowData.OTROPROC === "" ? null : rowData.OTROPROC;

          await Iras.create({
            ID: idValue,
            ANO: anoValue,
            SEMANA: semanaValue,
            SUB_REG_NT: subregValue,
            RED: redValue,
            MICRORED: microredValue,
            E_SALUD: esaludValue,
            UBIGEO: ubigeoValue,
            IRA_M2: iram2Value,
            IRA_2_11: ira211mValue,
            IRA_1_4A: ira14aCValue,
            NEU_2_11: neu211Value,
            NEU_1_4A: neu14aValue,
            NEU_5_9A: neu59aValue,
            NEU_10_19: neu1019Value,
            NEU_20_59: neu2059Value,
            NEU_60A: neu60aValue,
            HOS_M2: hosm2Value,
            HOS_2_11: hos211Value,
            HOS_1_4A: hos14aValue,
            HOS_5_9A: hos59aValue,
            HOS_10_19: hos1019Value,
            HOS_20_59: hos2059Value,
            HOS_60A: hos60aValue,
            NGR_M2: ngrm2Value,
            NGR_2_11: ngr211Value,
            NGR_1_4A: nrg14aValue,
            NGR_5_9A: ngr59aValue,
            NGR_60A: ngr60aValue,
            DIH_M2: dih2mValue,
            DIH_2_11: dih211mValue,
            DIH_1_4A: dih14aValue,
            DIH_5_9A: dih59aValue,
            DIH_10_19: dih1019aValue,
            DIH_20_59: dih2059aValue,
            DIH_60A: dih60aValue,
            DEH_M2: deh2mValue,
            DEH_2_11: deh211mValue,
            DEH_1_4A: deh14aValue,
            DEH_5_9A: deh59aValue,
            DEH_10_19: deh1019aValue,
            DEH_20_59: deh2059aValue,
            DEH_60A: deh60aValue,
            SOB_2A: sob2aValue,
            SOB_2_4A: sob24aValue,
            SOB_5_9A: sob59Value,
            SOB_10_19A: sob1019aValue,
            SOB_20_59A: sob2059aValue,
            FECHA_ING: fechaingValue,
            ETNIAPROC: etniaprocValue,
            ETNIAS: etniasValue,
            PROCEDE: procedeValue,
            OTROPROC: otroprocValue,
          });
        } catch (error) {
          console.error('Error en la inserción:', error);
          throw error;
        }
      }));

      insertedCount += block.length;
      console.log(`Registros insertados: ${insertedCount}/${totalRecords}`);
    }

    console.log("Operación de importación de datos completada.");
  } catch (error) {
    console.error('Error general:', error);
    throw error;
  }
};

const deleteEdasRecordsByYear = async (year) => {
  try {
    await Edas.destroy({
      where: {
        ANO: year
      }
    });
    console.log(`Registros del año ${year} eliminados correctamente.`);
  } catch (error) {
    console.error('Error eliminando registros:', error);
    throw error;
  }
};

const importDataEdasServices = async (data, blockSize = 10) => {
  console.log("importDataServices: ");
  try {
    const year = data[0].ANO; // Se asume que todos los registros tienen el mismo año
    await deleteEdasRecordsByYear(year); // Elimina los registros del año específico

    const totalRecords = data.length;
    let insertedCount = 0;

    while (insertedCount < totalRecords) {
      const block = data.slice(insertedCount, insertedCount + blockSize);
      await Promise.all(block.map(async (rowData) => {
        try {
          const idValue = rowData.ID === "" ? null : rowData.ID;
          const anoValue = rowData.ANO === "" ? null : rowData.ANO;
          const semanaValue = rowData.SEMANA === "" ? null : rowData.SEMANA;
          const subregValue = rowData.SUB_REG_NT === "" ? null : rowData.SUB_REG_NT;
          const redValue = rowData.RED === "" ? null : rowData.RED;
          const microredValue = rowData.MICRORED === "" ? null : rowData.MICRORED;
          const esaludValue = rowData.E_SALUD === "" ? null : rowData.E_SALUD;
          const ubigeoValue = rowData.UBIGEO === "" ? null : rowData.UBIGEO;
          const DAA_C1Value = rowData.DAA_C1 === "" ? null : rowData.DAA_C1;
          const DAA_C1_4Value = rowData.DAA_C1_4 === "" ? null : rowData.DAA_C1_4;
          const DAA_C5Value = rowData.DAA_C5 === "" ? null : rowData.DAA_C5;
          const DAA_C5_11Value = rowData.DAA_C5_11 === "" ? null : rowData.DAA_C5_11;
          const DAA_C12_17Value = rowData.DAA_C12_17 === "" ? null : rowData.DAA_C12_17;
          const DAA_C18_29Value = rowData.DAA_C18_29 === "" ? null : rowData.DAA_C18_29;
          const DAA_C30_59Value = rowData.DAA_C30_59 === "" ? null : rowData.DAA_C30_59;
          const DAA_C60Value = rowData.DAA_C60 === "" ? null : rowData.DAA_C60;
          const DAA_D1Value = rowData.DAA_D1 === "" ? null : rowData.DAA_D1;
          const DAA_D1_4Value = rowData.DAA_D1_4 === "" ? null : rowData.DAA_D1_4;
          const DAA_D5Value = rowData.DAA_D5 === "" ? null : rowData.DAA_D5;
          const DAA_D5_11Value = rowData.DAA_D5_11 === "" ? null : rowData.DAA_D5_11;
          const DAA_D12_17Value = rowData.DAA_D12_17 === "" ? null : rowData.DAA_D12_17;
          const DAA_D18_29Value = rowData.DAA_D18_29 === "" ? null : rowData.DAA_D18_29;
          const DAA_D30_59Value = rowData.DAA_D30_59 === "" ? null : rowData.DAA_D30_59;
          const DAA_D60Value = rowData.DAA_D60 === "" ? null : rowData.DAA_D60;
          const DAA_H1Value = rowData.DAA_H1 === "" ? null : rowData.DAA_H1;
          const DAA_H1_4Value = rowData.DAA_H1_4 === "" ? null : rowData.DAA_H1_4;
          const DAA_H5Value = rowData.DAA_H5 === "" ? null : rowData.DAA_H5;
          const DAA_H5_11Value = rowData.DAA_H5_11 === "" ? null : rowData.DAA_H5_11;
          const DAA_H12_17Value = rowData.DAA_H12_17 === "" ? null : rowData.DAA_H12_17;
          const DAA_H18_29Value = rowData.DAA_H18_29 === "" ? null : rowData.DAA_H18_29;
          const DAA_H30_59Value = rowData.DAA_H30_59 === "" ? null : rowData.DAA_H30_59;
          const DAA_H60Value = rowData.DAA_H60 === "" ? null : rowData.DAA_H60;
          const DIS_C1Value = rowData.DIS_C1 === "" ? null : rowData.DIS_C1;
          const DIS_C1_4Value = rowData.DIS_C1_4 === "" ? null : rowData.DIS_C1_4;
          const DIS_C5Value = rowData.DIS_C5 === "" ? null : rowData.DIS_C5;
          const DIS_C5_11Value = rowData.DIS_C5_11 === "" ? null : rowData.DIS_C5_11;
          const DIS_C12_17Value = rowData.DIS_C12_17 === "" ? null : rowData.DIS_C12_17;
          const DIS_C18_29Value = rowData.DIS_C18_29 === "" ? null : rowData.DIS_C18_29;
          const DIS_C30_59Value = rowData.DIS_C30_59 === "" ? null : rowData.DIS_C30_59;
          const DIS_C60Value = rowData.DIS_C60 === "" ? null : rowData.DIS_C60;
          const DIS_D1Value = rowData.DIS_D1 === "" ? null : rowData.DIS_D1;
          const DIS_D1_4Value = rowData.DIS_D1_4 === "" ? null : rowData.DIS_D1_4;
          const DIS_D5Value = rowData.DIS_D5 === "" ? null : rowData.DIS_D5;
          const DIS_D5_11Value = rowData.DIS_D5_11 === "" ? null : rowData.DIS_D5_11;
          const DIS_D12_17Value = rowData.DIS_D12_17 === "" ? null : rowData.DIS_D12_17;
          const DIS_D18_29Value = rowData.DIS_D18_29 === "" ? null : rowData.DIS_D18_29;
          const DIS_D30_59Value = rowData.DIS_D30_59 === "" ? null : rowData.DIS_D30_59;
          const DIS_D60Value = rowData.DIS_D60 === "" ? null : rowData.DIS_D60;
          const DIS_H1Value = rowData.DIS_H1 === "" ? null : rowData.DIS_H1;
          const DIS_H1_4Value = rowData.DIS_H1_4 === "" ? null : rowData.DIS_H1_4;
          const DIS_H5Value = rowData.DIS_H5 === "" ? null : rowData.DIS_H5;
          const DIS_H5_11Value = rowData.DIS_H5_11 === "" ? null : rowData.DIS_H5_11;
          const DIS_H12_17Value = rowData.DIS_H12_17 === "" ? null : rowData.DIS_H12_17;
          const DIS_H18_29Value = rowData.DIS_H18_29 === "" ? null : rowData.DIS_H18_29;
          const DIS_H30_59Value = rowData.DIS_H30_59 === "" ? null : rowData.DIS_H30_59;
          const DIS_H60Value = rowData.DIS_H60 === "" ? null : rowData.DIS_H60;
          const FECHA_INGValue = rowData.FECHA_ING === "" ? null : rowData.FECHA_ING;
          const ETNIAPROCValue = rowData.ETNIAPROC === "" ? null : rowData.ETNIAPROC;
          const ETNIASValue = rowData.ETNIAS === "" ? null : rowData.ETNIAS;
          const PROCEDEValue = rowData.PROCEDE === "" ? null : rowData.PROCEDE;
          const OTROPROCValue = rowData.OTROPROC === "" ? null : rowData.OTROPROC;

          await Edas.create({
            ID: idValue,
            ANO: anoValue,
            SEMANA: semanaValue,
            SUB_REG_NT: subregValue,
            RED: redValue,
            MICRORED: microredValue,
            E_SALUD: esaludValue,
            UBIGEO: ubigeoValue,
            DAA_C1: DAA_C1Value,
            DAA_C1_4: DAA_C1_4Value,
            DAA_C5: DAA_C5Value,
            DAA_C5_11: DAA_C5_11Value,
            DAA_C12_17: DAA_C12_17Value,
            DAA_C18_29: DAA_C18_29Value,
            DAA_C30_59: DAA_C30_59Value,
            DAA_C60: DAA_C60Value,
            DAA_D1: DAA_D1Value,
            DAA_D1_4: DAA_D1_4Value,
            DAA_D5: DAA_D5Value,
            DAA_D5_11: DAA_D5_11Value,
            DAA_D12_17: DAA_D12_17Value,
            DAA_D18_29: DAA_D18_29Value,
            DAA_D30_59: DAA_D30_59Value,
            DAA_D60: DAA_D60Value,
            DAA_H1: DAA_H1Value,
            DAA_H1_4: DAA_H1_4Value,
            DAA_H5: DAA_H5Value,
            DAA_H5_11: DAA_H5_11Value,
            DAA_H12_17: DAA_H12_17Value,
            DAA_H18_29: DAA_H18_29Value,
            DAA_H30_59: DAA_H30_59Value,
            DAA_H60: DAA_H60Value,
            DIS_C1: DIS_C1Value,
            DIS_C1_4: DIS_C1_4Value,
            DIS_C5: DIS_C5Value,
            DIS_C5_11: DIS_C5_11Value,
            DIS_C12_17: DIS_C12_17Value,
            DIS_C18_29: DIS_C18_29Value,
            DIS_C30_59: DIS_C30_59Value,
            DIS_C60: DIS_C60Value,
            DIS_D1: DIS_D1Value,
            DIS_D1_4: DIS_D1_4Value,
            DIS_D5: DIS_D5Value,
            DIS_D5_11: DIS_D5_11Value,
            DIS_D12_17: DIS_D12_17Value,
            DIS_D18_29: DIS_D18_29Value,
            DIS_D30_59: DIS_D30_59Value,
            DIS_D60: DIS_D60Value,
            DIS_H1: DIS_H1Value,
            DIS_H1_4: DIS_H1_4Value,
            DIS_H5: DIS_H5Value,
            DIS_H5_11: DIS_H5_11Value,
            DIS_H12_17: DIS_H12_17Value,
            DIS_H18_29: DIS_H18_29Value,
            DIS_H30_59: DIS_H30_59Value,
            DIS_H60: DIS_H60Value,
            FECHA_ING: FECHA_INGValue,
            ETNIAPROC: ETNIAPROCValue,
            ETNIAS:ETNIASValue,
            PROCEDE: PROCEDEValue,
            OTROPROC: OTROPROCValue,
          });
        } catch (error) {
          console.error('Error en la inserción:', error);
          throw error;
        }
      }));

      insertedCount += block.length;
      console.log(`Registros insertados: ${insertedCount}/${totalRecords}`);
    }

    console.log("Operación de importación de datos completada.");
  } catch (error) {
    console.error('Error general:', error);
    throw error;
  }
};


const importDepartamentoServices = async (data, blockSize) => {
  console.log("importDataServices: ", data);
  blockSize = 100;
  try {
    const totalRecords = data.length;
    let insertedCount = 0;

    while (insertedCount < totalRecords) {
      const block = data.slice(insertedCount, insertedCount + blockSize);
      await Promise.all(block.map(async (rowData) => {
        try {
          const ubigeoValue = rowData.ubigeo === "" ? null : rowData.ubigeo;
          const nombreValue = rowData.nombre === "" ? null : rowData.nombre;



          await Departamento.create({
            ubigeo: ubigeoValue,
            nombre: nombreValue,

          });
        } catch (error) {
          console.error('Error en la inserción:', error);
          throw error;
        }
      }));

      insertedCount += block.length;
      console.log(`Registros insertados: ${insertedCount}/${totalRecords}`);
    }

    console.log("Operación de importación de datos completada.");
  } catch (error) {
    console.error('Error general:', error);
    throw error;
  }
};


const importDiresaServices = async (data, blockSize) => {
  console.log("importDiresaServices: ", data);
  blockSize = 100;
  try {
    const totalRecords = data.length;
    let insertedCount = 0;

    while (insertedCount < totalRecords) {
      const block = data.slice(insertedCount, insertedCount + blockSize);
      await Promise.all(block.map(async (rowData) => {
        try {
          const codigoValue = rowData.codigo === "" ? null : rowData.codigo;
          const regionValue = rowData.region === "" ? null : rowData.region;
          const nombreValue = rowData.nombre === "" ? null : rowData.nombre;
          const departamentoValue = rowData.departamento === "" ? null : rowData.departamento;



          await Diresa.create({
            codigo: codigoValue,
            region: regionValue,
            nombre: nombreValue,
            departamento: departamentoValue,

          });
        } catch (error) {
          console.error('Error en la inserción:', error);
          throw error;
        }
      }));

      insertedCount += block.length;
      console.log(`Registros insertados: ${insertedCount}/${totalRecords}`);
    }

    console.log("Operación de importación de datos completada.");
  } catch (error) {
    console.error('Error general:', error);
    throw error;
  }
};

const importProvinciaServices = async (data, blockSize) => {
  console.log("importProvinciaServices: ");
  blockSize = 100;
  try {
    const totalRecords = data.length;
    let insertedCount = 0;

    while (insertedCount < totalRecords) {
      const block = data.slice(insertedCount, insertedCount + blockSize);
      await Promise.all(block.map(async (rowData) => {
        try {
          const ubigeoValue = rowData.ubigeo === "" ? null : rowData.ubigeo;
          const departamentoValue = rowData.departamento === "" ? null : rowData.departamento;
          const nombreValue = rowData.nombre === "" ? null : rowData.nombre;

          await Provincia.create({
            ubigeo: ubigeoValue,
            departamento: departamentoValue,
            nombre: nombreValue,
          });
        } catch (error) {
          console.error('Error en la inserción:', error);
          throw error;
        }
      }));

      insertedCount += block.length;
      console.log(`Registros insertados: ${insertedCount}/${totalRecords}`);
    }

    console.log("Operación de importación de datos completada.");
  } catch (error) {
    console.error('Error general:', error);
    throw error;
  }
};


const importDistritoServices = async (data, blockSize) => {
  console.log("importDistritoServices: ", data);
  blockSize = 100;
  try {
    const totalRecords = data.length;
    let insertedCount = 0;

    while (insertedCount < totalRecords) {
      const block = data.slice(insertedCount, insertedCount + blockSize);
      await Promise.all(block.map(async (rowData) => {
        try {
          console.log("datosDistrito:", rowData)
          const ubigeoValue = rowData.ubigeo === "" ? null : rowData.ubigeo;
          const departamentoValue = rowData.departamento === "" ? null : rowData.departamento;
          const provinciaValue = rowData.provinci === "" ? null : rowData.provinci;
          const nombreValue = rowData.nombre === "" ? null : rowData.nombre;
          const diresaValue = rowData.diresa === "" ? null : rowData.diresa;

          await Distrito.create({
            ubigeo: ubigeoValue,
            departamento: departamentoValue,
            provincia: provinciaValue,
            nombre: nombreValue,
            diresa: diresaValue,
          });
        } catch (error) {
          console.error('Error en la inserción:', error);
          throw error;
        }
      }));

      insertedCount += block.length;
      console.log(`Registros insertados: ${insertedCount}/${totalRecords}`);
    }

    console.log("Operación de importación de datos completada.");
  } catch (error) {
    console.error('Error general:', error);
    throw error;
  }
};


const importRedServices = async (data, blockSize) => {
  console.log("importRedServices: ");
  blockSize = 100;
  try {
    const totalRecords = data.length;
    let insertedCount = 0;

    while (insertedCount < totalRecords) {
      const block = data.slice(insertedCount, insertedCount + blockSize);
      await Promise.all(block.map(async (rowData) => {
        try {
          const registroIdValue = rowData.registroId === "" ? null : rowData.registroId;
          const subregionValue = rowData.subregion === "" ? null : rowData.subregion;
          const codigoValue = rowData.codigo === "" ? null : rowData.codigo;
          const nombreValue = rowData.nombre === "" ? null : rowData.nombre;
          const estadoValue = rowData.estado === "" ? null : rowData.estado;

          await Red.create({
            registroId: registroIdValue,
            subregion: subregionValue,
            codigo: codigoValue,
            nombre: nombreValue,
            estado: estadoValue,
          });
        } catch (error) {
          console.error('Error en la inserción:', error);
          throw error;
        }
      }));

      insertedCount += block.length;
      console.log(`Registros insertados: ${insertedCount}/${totalRecords}`);
    }

    console.log("Operación de importación de datos completada.");
  } catch (error) {
    console.error('Error general:', error);
    throw error;
  }
};
const importLocalidadServices = async (data, blockSize) => {
  console.log("importDistritoServices: ");
  blockSize = 100;
  try {
    const totalRecords = data.length;
    let insertedCount = 0;

    while (insertedCount < totalRecords) {
      const block = data.slice(insertedCount, insertedCount + blockSize);
      try {
        await Promise.all(
          block.map(async (rowData) => {
            try {
              const codlocValue = rowData.codloc === "" ? null : rowData.codloc;
              const cod_ineiValue = rowData.cod_inei === "" ? null : rowData.cod_inei;
              const nombreValue = rowData.nombre === "" ? null : rowData.nombre;
              const clasifValue = rowData.clasif === "" ? null : rowData.clasif;
              const xValue = rowData.x === "" ? null : rowData.x;
              const yValue = rowData.y === "" ? null : rowData.y;
              const coddepValue = rowData.coddep === "" ? null : rowData.coddep;
              const codprovValue = rowData.codprov === "" ? null : rowData.codprov;
              const ubigeoValue = rowData.ubigeo === "" ? null : rowData.ubigeo;

              await Localidad.create({
                codloc: codlocValue,
                cod_inei: cod_ineiValue,
                nombre: nombreValue,
                clasif: clasifValue,
                x: xValue,
                y: yValue,
                coddep: coddepValue,
                codprov: codprovValue,
                ubigeo: ubigeoValue,
              });
              insertedCount++;
            } catch (error) {
              console.error('Error en la inserción:', error);
            }
          })
        );
      } catch (error) {
        console.error('Error en el bloque de inserción:', error);
      }

      console.log(`Registros insertados: ${insertedCount}/${totalRecords}`);
    }

    console.log("Operación de importación de datos completada.");
  } catch (error) {
    console.error('Error general:', error);
    throw error;
  }
};


const importMicroredServices = async (data, blockSize) => {
  console.log("importMicroredServices: ");
  blockSize = 100;
  try {
    const totalRecords = data.length;
    let insertedCount = 0;

    while (insertedCount < totalRecords) {
      const block = data.slice(insertedCount, insertedCount + blockSize);
      await Promise.all(block.map(async (rowData) => {
        try {
          const registroIdValue = rowData.registroId === "" ? null : rowData.registroId;
          const subregionValue = rowData.subregion === "" ? null : rowData.subregion;
          const redValue = rowData.red === "" ? null : rowData.red;
          const codigoValue = rowData.codigo === "" ? null : rowData.codigo;
          const nombreValue = rowData.nombre === "" ? null : rowData.nombre;
          const estadoValue = rowData.estado === "" ? null : rowData.estado;

          await Microred.create({
            registroId: registroIdValue,
            subregion: subregionValue,
            red: redValue,
            codigo: codigoValue,
            nombre: nombreValue,
            estado: estadoValue,
          });
        } catch (error) {
          console.error('Error en la inserción:', error);
          throw error;
        }
      }));

      insertedCount += block.length;
      //console.log(`Registros insertados: ${insertedCount}/${totalRecords}`);
    }

    console.log("Operación de importación de datos completada.");
  } catch (error) {
    console.error('Error general:', error);
    throw error;
  }
};

const importEstablecimientoServices = async (data, blockSize) => {
  console.log("importEstablecimientoServices: ");
  blockSize = 100;
  try {
    const totalRecords = data.length;
    let insertedCount = 0;

    while (insertedCount < totalRecords) {
      const block = data.slice(insertedCount, insertedCount + blockSize);
      await Promise.all(block.map(async (rowData) => {
        try {
          const registroIdValue = rowData.registroId === "" ? null : rowData.registroId;
          const cod_estValue = rowData.cod_est === "" ? null : rowData.cod_est;
          const raz_socValue = rowData.raz_soc === "" ? null : rowData.raz_soc;
          const subregionValue = rowData.subregion === "" ? null : rowData.subregion;
          const redValue = rowData.red === "" ? null : rowData.red;
          const microredValue = rowData.microred === "" ? null : rowData.microred;
          const notificaValue = rowData.notifica === "" ? null : rowData.notifica;
          const tipoValue = rowData.tipo === "" ? null : rowData.tipo;
          const nivelValue = rowData.nivel === "" ? null : rowData.nivel;
          const renaesValue = rowData.renaes === "" ? null : rowData.renaes;
          const nombreValue = rowData.nombre === "" ? null : rowData.nombre;
          const categoriaValue = rowData.categoria === "" ? null : rowData.categoria;
          const estadoValue = rowData.estado === "" ? null : rowData.estado;
          const ubigeo_rnValue = rowData.ubigeo_rn === "" ? null : rowData.ubigeo_rn;

          await Establecimiento.create({
            registroId: registroIdValue,
            cod_est: cod_estValue,
            raz_soc: raz_socValue,
            subregion: subregionValue,
            red: redValue,
            microred: microredValue,
            notifica: notificaValue,
            tipo: tipoValue,
            nivel: nivelValue,
            renaes: renaesValue,
            nombre: nombreValue,
            categoria: categoriaValue,
            estado: estadoValue,
            ubigeo_rn: ubigeo_rnValue,
          });

          insertedCount++; // Incrementa el contador de registros insertados
        } catch (error) {
          console.error('Error en la inserción:', error);
          // Continuar con la inserción de otros registros incluso si se produce un error
        }
      }));

      console.log(`Registros insertados: ${insertedCount}/${totalRecords}`);
    }

    console.log("Operación de importación de datos completada.");
  } catch (error) {
    console.error('Error general:', error);
    throw error;
  }
};
const importProvicionalServices = async (data, blockSize) => {
  console.log("importProvicionalServices: ", data);
  blockSize = 10;
  try {
    // Eliminar registros existentes uno por uno
    await Provicional.destroy({ where: {} });

    const totalRecords = data.length;
    let insertedCount = 0;

    while (insertedCount < totalRecords) {
      const block = data.slice(insertedCount, insertedCount + blockSize);
      await Promise.all(block.map(async (rowData) => {
        try {
          const subregionValue = rowData.subregion === "" ? null : rowData.subregion;
          const redValue = rowData.red === "" ? null : rowData.red;
          const microredValue = rowData.microred === "" ? null : rowData.microred;
          const estadoValue = rowData.estado === "" ? null : rowData.estado;
          const N_REDValue = rowData.N_RED === "" ? null : rowData.N_RED;
          const N_Micro_REDValue = rowData.N_Micro_RED === "" ? null : rowData.N_Micro_RED;
          const N_EESSValue = rowData.N_EESS === "" ? null : rowData.N_EESS;
          const CATEGORIAValue = rowData.CATEGORIA === "" ? null : rowData.CATEGORIA;
          const DptoValue = rowData.Dpto === "" ? null : rowData.Dpto;
          const ProvValue = rowData.Prov === "" ? null : rowData.Prov;
          const DistritValue = rowData.Distrit === "" ? null : rowData.Distrit;
          const UBIGEO_RNValue = rowData.UBIGEO_RN === "" ? null : rowData.UBIGEO_RN;
          const COD_ESTValue = rowData.COD_EST === "" ? null : rowData.COD_EST;

          await Provicional.create({
            subregion: subregionValue,
            red: redValue,
            microred: microredValue,
            estado: estadoValue,
            N_RED: N_REDValue,
            N_Micro_RED: N_Micro_REDValue,
            N_EESS: N_EESSValue,
            CATEGORIA: CATEGORIAValue,
            Dpto: DptoValue,
            Prov: ProvValue,
            Distrit: DistritValue,
            UBIGEO_RN: UBIGEO_RNValue,
            COD_EST: COD_ESTValue,
          });
          insertedCount++;
          console.log(`Registros insertados: ${insertedCount}/${totalRecords}`);
        } catch (error) {
          console.error('Error en la inserción:', error);
          throw new Error('Error en la inserción de datos.');
        }
      }));
    }

    console.log("Operación de importación de datos completada.");
  } catch (error) {
    console.error('Error general:', error);
    throw error;
  }
};


module.exports = {
  importDataServices,
  importDepartamentoServices,
  importDiresaServices,
  importProvinciaServices,
  importDistritoServices,
  importLocalidadServices,
  importRedServices,
  importMicroredServices,
  importEstablecimientoServices,
  importProvicionalServices,
  importDataEdasServices,
}; 