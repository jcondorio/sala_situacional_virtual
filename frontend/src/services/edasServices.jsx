import { API_URL } from "../auth/contacts";
import axios from "axios";

// Servicio para obtener datos endémicos de IRAS
export const endemicoIrasService = async (ano) => {
    try {
        console.log("Intentando obtener datos endémicos de IRAS");
        const response = await axios(`${API_URL}/edas/endemico/${ano}`);
        console.log("asdasd",response.data.data);

        return response.data.data;
    } catch (error) {
        console.error("Error al obtener datos endémicos de IRAS:", error);
        throw error;
    }
};

// Servicio para obtener semanas de IRAS
export const semanasIrasService = async (ano) => {
    try {
        const response = await axios(`${API_URL}/edas/semannioiras/${ano}`);
        console.log("aver::",response.data.data)
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener semanas de IRAS:", error);
        throw error;
    }
};
export const distritoOneService = async (data) => {
    try {
        // Suponiendo que `data` es un objeto que contiene las propiedades que necesitas enviar como parámetros
        const response = await axios.get(`${API_URL}/edas/distritoonemap`, {
            params: data // Aquí es donde se envían los parámetros de consulta
        });
        console.log("distritoOneService", response.data.data);
        return response.data.data;
    } catch (error) {
        console.error("Error presentado:", error);
        throw error;
    }
};

export const lineBarEdadEdas = async (ano) => {
    try {
        const response = await axios(`${API_URL}/edas/lineBarEdadIras/${ano}`);
        console.log("lineBarEdadIras::", response.data.data)
        return response.data.data;
    } catch (error) {
        console.error("lineBarEdadIras de IRAS:", error);
        throw error;
    }
};

export const serviceMicroRedEdas = async (data) => {
    try {
        const response = await axios(`${API_URL}/edas/microred/${data}`);
        console.log("serviceRed::", response.data.data)
        return response.data.data;
    } catch (error) {
        console.error("lineBarEdadIras de serviceRed:", error);
        throw error;
    }
};

export const serviceEstrablecimientosEdas = async (red,microred) => {
    try {
        const response = await axios(`${API_URL}/edas/establecimiento/${red}/${microred}`);
        console.log("serviceRed::", response.data.data)
        return response.data.data;
    } catch (error) {
        console.error("lineBarEdadIras de serviceRed:", error);
        throw error;
    }
};

export const serviceActializarConsultaEdas = async (data) => {
    try {
        const response = await axios.get(`${API_URL}/edas/consultairas`, { params: data });
        console.log("serviceRed::", response.data.data)
        return response.data.data;
    } catch (error) {
        console.error("lineBarEdadIras de serviceRed:", error);
        throw error;
    }
};
