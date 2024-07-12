const { getPobDistritServices } = require("../services/poblacionServices");

const getPobDistritController = async (req, res) => {
    ////console.log("getPobDistritController",req.params)
    try {
        const responseController = await getPobDistritServices(req.params);
        res.status(200).json({ message: 'respuesta del año', data: responseController });
    } catch (error) {
        console.error('Error importing data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
module.exports = { 
    getPobDistritController, 
};