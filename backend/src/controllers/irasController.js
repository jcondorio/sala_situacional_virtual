const { getIrasSemanasServices } = require("../services/irasServices");
const getIrasSemanasController = async (req, res) => {
    console.log("en el controlador::")
    try {
        const getIras = await getIrasSemanasServices();
        res.status(200).json({ message: 'User created successfully', data: getIras });
    } catch (error) {
        console.error('Error importing data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
module.exports = { getIrasSemanasController };