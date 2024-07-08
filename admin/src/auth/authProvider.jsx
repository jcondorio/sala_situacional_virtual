import React, { useContext, createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Creamos el contexto de autenticación
const AuthContext = createContext({
    isAuthenticated: false,
    getAccessToken: () => {},
    saveUser: (userData) => {},
    getRefreshToken: () => {},
});

function parseJwt (token){
    try{
      console.log("token : ",token);
      const base64Url = token.split(".")[1];
      console.log("base64uril: ",base64Url);
      const base64 = base64Url.replace(/-/g,"+").replace(/_/g,"/");
      console.log("base64: ",base64);
      const jsonPayload = decodeURIComponent(window.atob(base64).split("").map(function(c){
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(""));
      console.log("patload: ",jsonPayload);
      return JSON.parse(jsonPayload);
    } catch (error){
      localStorage.removeItem("token");
      console.error("Error parsing JWT:", error);
          return 0;  // Retorna 0 si algo sale mal
    }
      
  }
  const token = localStorage.getItem("token");
  let tokenEsistAndStillValid = false;
  
  if (token) {
    tokenEsistAndStillValid = (parseJwt(token).exp * 1000 > Date.now());
    console.log("tokenvalid: ",tokenEsistAndStillValid)
  }else{
    tokenEsistAndStillValid = false;
    localStorage.removeItem("token");
  }
  

const AuthProvider = ({ children }) => {
    const [name, setName] = useState();
    const [id, setId] = useState();
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            let tokenEsistAndStillValid = false;
            tokenEsistAndStillValid = parseJwt(token).exp * 1000 > Date.now();
            console.log("tokenvalid: ", tokenEsistAndStillValid)

            if (tokenEsistAndStillValid) {
                console.log("entrando:")
                const parsedToken = parseJwt(token);
                console.log("parsedToken",parsedToken);
                console.log("parsedToken",parsedToken)
                if (parsedToken) {
                    setName(parsedToken.name);
                    setId(parsedToken.id);
                }
            } else {
                localStorage.removeItem("token");
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    }, [navigate]);

    // Estados para almacenar el estado de autenticación y los tokens
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");

    // Efecto para inicializar el estado de autenticación y los tokens desde el localStorage
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const { accessToken, refreshToken } = JSON.parse(token);
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            setIsAuthenticated(true);
        }
    }, []);

    // Función para obtener el token de acceso
    function getAccessToken() {
        return accessToken;
    }

    // Función para obtener el token de actualización
    function getRefreshToken() {
        return refreshToken;
    }

    // Función para guardar la información del usuario y los tokens en el localStorage y en el estado
    function saveUser(userData) {
        setAccessToken(userData.body.accessToken);
        setRefreshToken(userData.body.refreshToken);
        localStorage.setItem("token", JSON.stringify(userData.body));
 
            const token = localStorage.getItem("token");
            if (token) {
                let tokenEsistAndStillValid = false;
                tokenEsistAndStillValid = parseJwt(token).exp * 1000 > Date.now();
                console.log("tokenvalid: ", tokenEsistAndStillValid)
    
                if (tokenEsistAndStillValid) {
                    console.log("entrando:")
                    const parsedToken = parseJwt(token);
                    console.log("parsedToken",parsedToken);
                    console.log("parsedToken",parsedToken)
                    if (parsedToken) {
                        setName(parsedToken.userName);
                        setId(parsedToken.id);
                    }
                } else {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            } else {
                navigate("/login");
            }
        setIsAuthenticated(true);
    }

    // Renderizamos el proveedor de contexto con los valores proporcionados
    return (
        <div>
            <AuthContext.Provider value={{ isAuthenticated, getAccessToken, saveUser, getRefreshToken,name,id }}>
                {children}
            </AuthContext.Provider>
        </div>
    );
}

// Función personalizada para utilizar el contexto de autenticación en componentes hijos
export const useAuth = () => useContext(AuthContext);

// Exportamos el proveedor de autenticación
export default AuthProvider;
