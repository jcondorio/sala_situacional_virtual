const { getAnnioIrasServices, getAnnioEdasServices, getCheckedIrasServices, postDateEndemicoService } = require("../services/otrosServices");


const getAnnioIrasController = async (req, res) => {
    ////console.log("en el controlador::")
    try {
        const responseController = await getAnnioIrasServices();
        res.status(200).json({ message: 'respuesta del año', data: responseController });
    } catch (error) {
        console.error('Error importing data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const getAnnioEdasController = async (req, res) => {
    //console.log("en el controlador::")
    try {
        const responseController = await getAnnioEdasServices();
        res.status(200).json({ message: 'respuesta del año', data: responseController });
    } catch (error) {
        console.error('Error importing data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



const getCheckedIrasController = async (req, res) => {
    //console.log("en el controlador::")
    try {
        const responseController = await getCheckedIrasServices();
        res.status(200).json({ message: 'respuesta del año', data: responseController });
    } catch (error) {
        console.error('Error importing data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const postDateEndemicoController = async (req, res) => {
    //console.log("en el controlador::")
    try {
        const responseController = await postDateEndemicoService(req.body);
        res.status(200).json({ message: 'respuesta del año', data: responseController });
    } catch (error) {
        console.error('Error importing data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
module.exports = { 
    getAnnioIrasController, 
    getAnnioEdasController,
    getCheckedIrasController,
    postDateEndemicoController,
};