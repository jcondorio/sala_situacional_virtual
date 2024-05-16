import React from 'react';
import { MapContainer, GeoJSON, TileLayer, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Datos GeoJSON de las provincias en Tacna (ejemplo)
import datosProvincias from '../data/provinciasTacna.json';

const MapaTacnaConProvincias = () => {
  return (
    <MapContainer center={[-17.51465, -70.25362]} zoom={7.2} style={{ height: '200px', width: '200px' }}>
      {/*<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />*/}
      
      {/* Iterar sobre los datos de las provincias y renderizar cada una */}
      {datosProvincias.features.map((feature, idx) => (
        <GeoJSON key={idx} data={feature} style={() => ({
          fillColor: getRandomColor(), // Función para obtener un color aleatorio
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

// Función para obtener un color aleatorio en formato hexadecimal
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default MapaTacnaConProvincias;
