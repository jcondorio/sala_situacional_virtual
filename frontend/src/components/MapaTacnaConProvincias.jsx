import React, { useEffect, useState } from 'react';
import { MapContainer, GeoJSON, TileLayer, Popup } from 'react-leaflet';
import axios from "axios";
import { API_URL } from "../auth/contacts";
import 'leaflet/dist/leaflet.css';

// Datos GeoJSON de las provincias en Tacna (ejemplo)
import datosProvincias from '../data/provinciasTacna.json';

const MapaTacnaConProvincias = () => {

  const [distritos, setDistritos] = useState([]);

  const distritosSemana = async () => {
    try {
      const response = await axios.get(`${API_URL}/iras/distrit`);
      setDistritos(response.data.data);
      console.log("distritosSemana:", response.data.data);
    } catch (error) {
      console.error("Error fetching estudiantes data:", error);
    }
  };

  useEffect(() => {
    console.log("datosfeatures:", datosProvincias);
    distritosSemana();
  }, []);

  const getRandomColor = (distritoNombre) => {
    console.log("getRandomColor", distritoNombre);
    const distrito = distritos.find(distrito => distrito.Distrit === distritoNombre);
    if (distrito) {
      distrito.casos=distrito.casos;
      const hexadecimal = distrito.casos.toString(16);
      console.log("hexadecimal",hexadecimal)
      if(hexadecimal==0){
        return `#ffffff`;
      }
      
      return `#${hexadecimal}ebee`;
    } else {
      return '#ffffff';
    }
  };

  return (
    <MapContainer center={[-17.51465, -70.25362]} zoom={7.5} style={{ height: '350px', width: '350px' }}>
      {/*<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />*/}

      {/* Iterar sobre los datos de las provincias y renderizar cada una */}
      {datosProvincias.features.map((feature, idx) => (
        <GeoJSON key={idx} data={feature} style={() => ({
          fillColor: getRandomColor(feature.properties.nombre), // Función para obtener un color aleatorio
          color: 'black',
          weight: 1,
          fillOpacity: 0.7
        })}>
          {/* Popup para mostrar el nombre de la provincia */}
          <Popup>{feature.properties.nombre}</Popup>
        </GeoJSON>
      ))}
    </MapContainer>
  );
};

export default MapaTacnaConProvincias;
