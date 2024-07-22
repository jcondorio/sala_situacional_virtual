import axios from "axios";
import {API_URL} from "../auth/constants";

const getAnniosIras = async()=>{
    try{
        const response = await axios.get(`${API_URL}/otros/checkediras`);
        console.log("serviseiras: ",response.data.data);
        return response.data.data;
    }catch(error){
        console.error('Error fetching users', error);
        throw error;
    }
};

export { getAnniosIras };