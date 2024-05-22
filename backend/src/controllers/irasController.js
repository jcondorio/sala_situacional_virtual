const { getIrasSemanasServices, getIrasUltimaSemanaDistrit, getTotalCasosIrasAnualService, getTotalCasosIrasUltimaSemana, getTotalDistritosCasosUltimaSemana, getTotalEstService, getTotalEstrablecimientosCasosUltimaSemana, getTotSemIrasEstService } = require("../services/irasServices");
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

const getIrasUltimaSemanaDistritController = async (req, res) => {
    console.log("getIrasUltimaSemanaDistritController")
    try {
        const getIras = await getIrasUltimaSemanaDistrit();
        res.status(200).json({ message: 'User created successfully', data: getIras });
    } catch (error) {
        console.error('Error importing data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const getTotIrasController = async (req,res) => {
    console.log("getTotIrasController")
    try {
        const getIras = await getTotalCasosIrasAnualService();
        res.status(200).json({ message: 'User created successfully', data: getIras });
    } catch (error) {
        console.error('Error importing data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getTotIrasSemanaController = async (req,res) => {
    console.log("getTotIrasSemanaController")
    try {
        const getIras = await getTotalCasosIrasUltimaSemana();
        res.status(200).json({ message: 'User created successfully', data: getIras });
    } catch (error) {
        console.error('Error importing data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getTotDistritosCasosController = async (req,res) => {
    console.log("getTotDistritosCasosController")
    try {
        const getIras = await getTotalDistritosCasosUltimaSemana();
        res.status(200).json({ message: 'User created successfully', data: getIras });
    } catch (error) {
        console.error('Error importing data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getTotEstCasosController = async (req,res) => {
    console.log("getTotEstCasosController")
    try {
        const getIras = await getTotalEstrablecimientosCasosUltimaSemana();
        res.status(200).json({ message: 'User created successfully', data: getIras });
    } catch (error) {
        console.error('Error importing data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const getTotalEstController = async (req,res) => {
    console.log("getTotEstCasosController")
    try {
        const getIras = await getTotalEstService();
        res.status(200).json({ message: 'User created successfully', data: getIras });
    } catch (error) {
        console.error('Error importing data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const getTotSemIrasEstController = async (req,res) => {
    console.log("getTotSemIrasEstController",req.params)
    try {
        const getIras = await getTotSemIrasEstService(req.params);
        res.status(200).json({ message: 'User created successfully', data: getIras });
    } catch (error) {
        console.error('Error importing data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
module.exports = { 
    getIrasSemanasController, 
    getIrasUltimaSemanaDistritController, 
    getTotIrasController, 
    getTotIrasSemanaController, 
    getTotDistritosCasosController,
    getTotEstCasosController,
    getTotalEstController,
    getTotSemIrasEstController,
};