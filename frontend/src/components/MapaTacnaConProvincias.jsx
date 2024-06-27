import React, { useEffect, useState } from "react";
import { MapContainer, GeoJSON, Popup, TileLayer } from "react-leaflet";
import axios from "axios";
import { API_URL } from "../auth/contacts";
import "leaflet/dist/leaflet.css";
import { Box, Grid, Paper, Typography } from "@mui/material";

// Datos GeoJSON de las provincias en Tacna (ejemplo)
import datosProvincias from "../data/provinciasTacna.json";
const MapaTacnaConProvincias = () => {
  const [distritos, setDistritos] = useState([]);
  const [sumaTotalCasos, setSumaTotalCasos] = useState(0);


  const pobDistrUltimoAnnio = async ()=>{
    try{
      const response = await axios.get(`${API_URL}/poblacion/distrit`);
      //setPobDistritU
    } catch{

    }
  }
  useEffect(() => {
    const fetchDistritos = async () => {
      try {
        const response = await axios.get(`${API_URL}/iras/distrit`);
        setDistritos(response.data.data);

        let sumaTotal = 0;
        response.data.data.forEach((distrito) => {
          sumaTotal += parseInt(distrito.casos);
        });
        setSumaTotalCasos(sumaTotal);

        console.log("distritosSemana:", response.data.data);
      } catch (error) {
        console.error("Error fetching estudiantes data:", error);
      }
    };

    fetchDistritos();
  }, []);

  const getRandomColor = (distritoNombre) => {
    const distrito = distritos.find(
      (distrito) => distrito.Distrit === distritoNombre
    );

    if (distrito) {
      const casos = parseInt(distrito.casos);
      const maximoAno = distrito.maximoAno;
      const ratio = (casos / maximoAno) * 1000;

      if (ratio >= 252.5 && ratio < 626.4) {
        return "#fce4d5";
      } else if (ratio >= 626.4 && ratio < 949.4) {
        return "#f4b180";
      } else if (ratio >= 949.4 && ratio < 1463.8) {
        return "#c15c0c";
      } else if (ratio >= 1463.8 && ratio < 12412.2) {
        return "#853b0c";
      } else {
        return "#ffffff";
      }
    }

    return "#ffffff";
  };

  return (
    <Box
      height="100vh"
      alignItems="center"
      justifyContent="flex-start"
    >
      <Box>
        <MapContainer
          center={[-17.51465, -70.25362]}
          zoom={7.5}
          style={{ height: "350px", width: "500px", background: "none" }}
          zoomControl={false}
          dragging={false}
          scrollWheelZoom={false}
        >
          {/* Agregar un TileLayer transparente */}
          <TileLayer url="" style={{ display: "none" }} />
          {/* Iterar sobre los datos de las provincias y renderizar cada una */}
          {datosProvincias.features.map((feature, idx) => (
            <GeoJSON
              key={idx}
              data={feature}
              style={() => ({
                fillColor: getRandomColor(feature.properties.nombre),
                color: "black",
                weight: 1,
                fillOpacity: 1,
              })}
            >
              {/* Popup para mostrar el nombre de la provincia */}
              <Popup>
                <div>
                  <Typography variant="subtitle1">
                    <strong>Distrito:</strong> {feature.properties.nombre}
                  </Typography>
                  {distritos
                    .filter((d) => d.Provincia === feature.properties.nombre)
                    .map((distrito, idx) => (
                      <Typography key={idx} variant="body2">
                        <strong>Distrito:</strong> {distrito.Distrit} -{" "}
                        <strong>Casos:</strong> {distrito.casos}
                      </Typography>
                    ))}
                </div>
              </Popup>
            </GeoJSON>
          ))}
        </MapContainer>
        <Grid container>
          <Grid xs={8}></Grid>
          <Grid xs={4}>
            <Paper
              elevation={3}
              style={{
                position: "relative",
                bottom: "10px",
                right: "10px",
                backgroundColor: "rgba(255, 255, 255, 0.8)", // Fondo semi-transparente
                padding: "5px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <Typography variant="subtitle2">
                <strong>Leyenda de Casos por 1000 habitantes</strong>
              </Typography>
              <Box
                style={{
                  background: "#fce4d5",
                  padding: "3px",
                  fontSize: "12px",
                }}
              >
                252.5 - 626.4
              </Box>
              <Box
                style={{
                  background: "#f4b180",
                  padding: "3px",
                  fontSize: "12px",
                }}
              >
                626.4 - 949.4
              </Box>
              <Box
                style={{
                  background: "#c15c0c",
                  padding: "3px",
                  fontSize: "12px",
                }}
              >
                949.4 - 1463.8
              </Box>
              <Box
                style={{
                  background: "#853b0c",
                  padding: "3px",
                  fontSize: "12px",
                }}
              >
                1463.8 - 12412.2
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Agregar la leyenda al mapa */}
    </Box>
  );
};

export default MapaTacnaConProvincias;
