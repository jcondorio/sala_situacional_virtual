
const { importDataEdasServices,importDiresaServices, importDataPoblacionServices, importProvinciaServices, importDistritoServices, importLocalidadServices, importDepartamentoServices, importRedServices, importMicroredServices, importEstablecimientoServices, importDataServices, importProvicionalServices } = require("../services/importServices");
const importController = async (req, res) => {
    //console.log("en el controlador::")
    try {
        //console.log(req.body)
        //const getNivel = await importDepartamentoServices(req.body);
        //const getNivel = await importDiresaServices(req.body);
        //const getNivel = await importProvinciaServices(req.body);
        //const getNivel = await importDistritoServices(req.body);
        //const getNivel = await importLocalidadServices(req.body);
        //const getNivel = await importRedServices(req.body);
        //const getNivel = await importMicroredServices(req.body);
        //const getNivel = await importEstablecimientoServices(req.body);
        const getNivel = await importDataServices(req.body);
        //const getNivel = await importProvicionalServices(req.body);
        //const getNivel = await importDataEdasServices(req.body);
        //const getNivel = await importDataPoblacionServices(req.body);

        res.status(200).json({ message: 'User created successfully', student: getNivel });
    } catch (error) {
        console.error('Error importing data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
module.exports = { importController };