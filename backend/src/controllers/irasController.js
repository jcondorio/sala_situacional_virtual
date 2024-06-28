const { getIrasSemanasServices, getcasesemanadistritServices, getgrafico2Services, getIrasUltimaSemanaDistrit, getTotalCasosIrasAnualService, getTotalCasosIrasUltimaSemana, getTotalDistritosCasosUltimaSemana, getTotalEstService, getTotalEstrablecimientosCasosUltimaSemana, getTotSemIrasEstService, getDataDistritService, getDatosGeneralesServices, getCasosDistritUltSemServices, getCasosDistritSemServices } = require("../services/irasServices");
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
const getDataDistritController = async (req,res) => {
    console.log("getTotSemIrasEstController")
    try {
        const getIras = await getDataDistritService();
        res.status(200).json({ message: 'User created successfully', data: getIras });
    } catch (error) {
        console.error('Error importing data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getDatosGeneralesController = async (req,res) => {
    console.log("getDatosGeneralesController",req.params)
    try {
        const getIras = await getDatosGeneralesServices(req.params);
        res.status(200).json({ message: 'User created successfully', data: getIras });
    } catch (error) {
        console.error('Error importing data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getCasosDistritUltController = async (req,res) => {
    console.log("getDatosGeneralesController",req.params)
    try {
        const getIras = await getCasosDistritSemServices(req.params);
        res.status(200).json({ message: 'User created successfully', data: getIras });
    } catch (error) {
        console.error('Error importing data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getcasesemanadistritController = async (req,res) => {
    console.log("getcasesemanadistritController",req.params)
    try {
        const getIras = await getcasesemanadistritServices(req.params);
        res.status(200).json({ message: 'User created successfully', data: getIras });
    } catch (error) {
        console.error('Error importing data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getCasosDistritUltSemController = async (req,res) => {
    console.log("getCasosDistritUltSemServices",req.params)
    try {
        const getIras = await getCasosDistritSemServices(req.params);
        res.status(200).json({ message: 'User created successfully', data: getIras });
    } catch (error) {
        console.error('Error importing data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getgrafico2Controller = async (req,res) => {
    console.log("getgrafico2Controller",req.params)
    try {
        const getIras = await getgrafico2Services(req.params);
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
    getDataDistritController,
    getDatosGeneralesController,
    getCasosDistritUltController,
    getcasesemanadistritController,
    getCasosDistritUltSemController,
    getgrafico2Controller,
};