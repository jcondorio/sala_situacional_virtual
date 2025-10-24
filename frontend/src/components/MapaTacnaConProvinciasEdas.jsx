import React, { useEffect, useState } from "react";
import { MapContainer, GeoJSON, Popup, Tooltip,TileLayer } from "react-leaflet";
import axios from "axios";
import { API_URL } from "../auth/contacts";
import "leaflet/dist/leaflet.css";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import * as ss from "simple-statistics";

// Datos GeoJSON de las provincias en Tacna (ejemplo)
import datosProvincias from "../data/provinciasTacna.json";

const MapaTacnaConProvinciasEdas = ({ annio, semana, distritoOne1 }) => {
  const [distritos, setDistritos] = useState([]);
  const [sumaTotalCasos, setSumaTotalCasos] = useState(0);
  const [quartiles, setQuartiles] = useState({ q1: 0, q2: 0, q3: 0 });
  const [tiaDistrit, setTiaDistrit] = useState();
  const [datadistrit, setDataDistrit] = useState();
const pobDistritosxAnnioSemana = async ({ annio = "", semana = "" } = {}) => {
  try {
    console.log("pobDistritosxAnnioSemana1", annio, "--", semana);
    const response = await axios.get(
      `${API_URL}/poblacion/distritedas/${annio}/${semana}`
    );
    setDataDistrit(response.data.data);
    console.log("pobDistritosxAnnioSemana2", response.data.data);
    if (response.data.data.length > 0) {
      const tiaValues = response.data.data.map((item) =>
        parseFloat(item.tia.toFixed(2))
      );
      const calculatedQuartiles = calculateQuartiles(tiaValues);
      console.log("pobDistritosxAnnioSemana3", calculatedQuartiles);
      setQuartiles(calculatedQuartiles);
    }
    setTiaDistrit(response.data.data);
  } catch (error) {
    console.error("erroraso", error);
  }
};

  const calculateQuartiles = (data) => {
    const sortedData = data.slice().sort((a, b) => a - b);
    return {
      q1: parseFloat(ss.quantileSorted(sortedData, 0.25).toFixed(2)),
      q2: parseFloat(ss.quantileSorted(sortedData, 0.5).toFixed(2)),
      q3: parseFloat(ss.quantileSorted(sortedData, 0.75).toFixed(2)),
    };
  };

  useEffect(() => {
    const fetchDistritos = async () => {
      try {
        const response = await axios.get(`${API_URL}/edas/distrit`);
        setDistritos(response.data.data);
        console.log("fetchDistritosedas",response.data.data);
        let sumaTotal = 0;
        response.data.data.forEach((distrito) => {
          sumaTotal += parseInt(distrito.casos);
        });
        setSumaTotalCasos(sumaTotal);

        console.log("distritosSemanaedas:", response.data.data);
      } catch (error) {
        console.error("Error fetching estudiantes data:", error);
      }
    };

    fetchDistritos();
  }, []);

  useEffect(() => {
    if (annio && semana) {
      pobDistritosxAnnioSemana({ annio, semana });
    }
  }, [annio, semana]);

  const getRandomColor = (distritoNombre) => {
    if (
      !tiaDistrit ||
      !quartiles ||
      !quartiles.q1 ||
      !quartiles.q2 ||
      !quartiles.q3
    ) {
      console.error("Datos no disponibles para calcular el color");
      return "#ffffff";
    }

    const distrito = tiaDistrit.find(
      (distrito) => distrito.distrito === distritoNombre
    );

    if (distrito) {
      const ratio = parseInt(distrito.tia, 10);

      if (ratio >= 0 && ratio < quartiles.q1) {
        return "#fce4d5";
      } else if (ratio >= quartiles.q1 && ratio < quartiles.q2) {
        return "#f4b180";
      } else if (ratio >= quartiles.q2 && ratio < quartiles.q3) {
        return "#c15c0c";
      } else if (ratio >= quartiles.q3) {
        return "#853b0c";
      } else {
        return "#ffffff";
      }
    }

    return "#ffffff";
  };
  const probando = () => {
    console.log("rarara");
  };

  return (
    <Box>
      <Box>
        <Box
          container
          sx={{
            display: "flex",
            justifyContent: "center",
            p: 1,
            m: 1,
            borderRadius: 1,
          }}
        >
          <MapContainer
            center={[-17.51465, -70.25362]}
            zoom={7.5}
            style={{ height: "350px", width: "320px", background: "none" }}
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
                eventHandlers={{
                  click: (e) => {
                    distritoOne1(feature.properties.nombre);
                    // Asegurarse de que no haya estilos de borde adicionales
                    e.target.setStyle({
                    });
                  },
                  mouseout: (e) => {
                    // Restaurar el estilo cuando el ratón sale de la capa
                    e.target.setStyle({
                      weight: 1, // Restaurar el borde si es necesario
                      color: "black",
                      fillOpacity: 1,
                    });
                  },
                }}
              >
                {/* Popup para mostrar el nombre de la provincia */}
                <Tooltip
                  direction="top"
                  opacity={0.9} // Ajusta la opacidad del Tooltip
                  permanent={false} // No mantener el Tooltip visible de forma permanente
                >
                  <div>
                    <Typography variant="subtitle1">
                      <strong>Distrito:</strong> {feature.properties.nombre}
                      {datadistrit && datadistrit.length > 0 && (
                        <>
                          {datadistrit
                            .filter(
                              (item) =>
                                item.distrito === feature.properties.nombre
                            )
                            .map((item, idx) => (
                              <React.Fragment key={idx}>
                                <br />
                                <strong>Tasa:</strong> {item.tia.toFixed(2)}
                              </React.Fragment>
                            ))}
                        </>
                      )}
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
                </Tooltip>
              </GeoJSON>
            ))}
          </MapContainer>
        </Box>
        <Paper
          elevation={3}
          style={{
            position: "relative",
            marginTop: "0%",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "3px",
            border: "1px solid #ccc",
          }}
        >
          <Typography variant="subtitle2">
            <strong>T.I.A. x 1000</strong>
          </Typography>
          <Box
            style={{
              background: "#fce4d5",
              padding: "2px",
              fontSize: "12px",
              color: "black",
            }}
          >
            <Grid container>
              <Grid item xs={6}>
                muy bajo riesgo
              </Grid>
              <Grid item xs={6}>
                0 - {quartiles.q1}
              </Grid>
            </Grid>
          </Box>
          <Box
            style={{
              background: "#f4b180",
              padding: "2px",
              fontSize: "12px",
              color: "black",
            }}
          >
            <Grid container>
              <Grid item xs={6}>
                bajo riesgo
              </Grid>
              <Grid item xs={6}>
                {quartiles.q1} - {quartiles.q2}
              </Grid>
            </Grid>
          </Box>
          <Box
            style={{
              background: "#c15c0c",
              padding: "2px",
              fontSize: "12px",
              color: "black",
            }}
          >
            <Grid container>
              <Grid item xs={6}>
                Mediano riesgo
              </Grid>
              <Grid item xs={6}>
                {quartiles.q2} - {quartiles.q3}
              </Grid>
            </Grid>
          </Box>
          <Box
            style={{
              background: "#853b0c",
              padding: "2px",
              fontSize: "12px",
              color: "black",
            }}
          >
            <Grid container>
              <Grid item xs={6}>
                Alto riesgo
              </Grid>
              <Grid item xs={6}>
                {quartiles.q3} - a mas
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>

      {/* Agregar la leyenda al mapa */}
    </Box>
  );
};

export default MapaTacnaConProvinciasEdas;
