import React, { useState } from "react";
import { Box, Button, Typography, useTheme, Container, Paper, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from "axios";
import { API_URL } from "../../auth/constants";
import CSVReader from 'react-csv-reader';

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [datosCSV, setDatosCSV] = useState([]);
  const [csvData, setCsvData] = useState(null);

  const handleFile = (data) => {
    const headers = data[0];
    const rows = data.slice(1);
    const formattedData = rows.reduce((acc, row) => {
      if (row.length === headers.length) {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        acc.push(obj);
      } else {
        console.warn(`Ignoring row: ${row} - mismatch with headers`);
      }
      return acc;
    }, []);
    setCsvData(formattedData);
  };

  const importData = async () => {
    try {
      if (csvData) {
        const response = await axios.post(`${API_URL}/import`, csvData);
        console.log("Data imported successfully:", response.data);
      } else {
        console.log("csvData is empty");
      }
    } catch (error) {
      console.error("Error importing data:", error);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: theme.spacing(4), marginTop: theme.spacing(4) }}>
        <Header title="Importar Datos del Equipo" subtitle="Sube un archivo CSV para importar los datos del equipo" />
        
        <Box sx={{ marginTop: theme.spacing(4) }}>
          <CSVReader
            onFileLoaded={handleFile}
            inputId="csv-input"
            inputStyle={{ display: 'none' }}
            inputProps={{ accept: ".csv" }}
          />
          <label htmlFor="csv-input">
            <Button
              variant="contained"
              component="span"
              sx={{ backgroundColor: colors.primary[600], color: colors.grey[100] }}
            >
              Subir Archivo CSV
            </Button>
          </label>
        </Box>
        
        <Box sx={{ marginTop: theme.spacing(4) }}>
          <Typography variant="h6">Datos del archivo CSV:</Typography>
          <Paper sx={{ maxHeight: 400, overflow: 'auto', padding: theme.spacing(2) }}>
            <ul>
              {csvData && csvData.map((fila, indiceFila) => (
                <li key={indiceFila}>{JSON.stringify(fila)}</li>
              ))}
            </ul>
          </Paper>
        </Box>

        <Box sx={{ marginTop: theme.spacing(4) }}>
          <Button
            variant="contained"
            onClick={importData}
            sx={{ backgroundColor: colors.primary[600], color: colors.grey[100] }}
          >
            Importar Datos
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Team;
