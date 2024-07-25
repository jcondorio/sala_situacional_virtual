import { API_URL } from "../auth/contacts";
import axios from "axios";

// Servicio para obtener datos endémicos de IRAS
export const endemicoIrasService = async () => {
    try {
        console.log("Intentando obtener datos endémicos de IRAS");
        const response = await axios(`${API_URL}/iras/endemico`);
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener datos endémicos de IRAS:", error);
        throw error; // Lanzar el error para que pueda ser manejado en el lugar donde se llama esta función
    }
};

// Servicio para obtener semanas de IRAS
export const semanasIrasService = async () => {
    try {
        const response = await axios(`${API_URL}/iras/semannioiras/2024`);
        console.log("aver::",response.data.data)
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener semanas de IRAS:", error);
        throw error; // Lanzar el error para que pueda ser manejado en el lugar donde se llama esta función
    }
};