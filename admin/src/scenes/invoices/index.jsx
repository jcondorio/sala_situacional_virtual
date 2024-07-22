import React, { useState } from "react";
import { Box, Container, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Header from "../global/Header";
import CsvReader from "../../Hooks/CsvReader";
import CsvDataList from "../../Hooks/CsvDataList";
import ImportButton from "../../components/common/ImportButtonPobl";
import { tokens } from "../../theme";

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [csvData, setCsvData] = useState(null);

  // Obtener el token de localStorage
  const token = localStorage.getItem("token");

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: theme.spacing(4), marginTop: theme.spacing(4) }}>
        <Header title="Importar Datos de Poblacion" subtitle="Sube un archivo CSV para importar los datos del equipo" />
        
        <Box sx={{ marginTop: theme.spacing(4) }}>
          <CsvReader setCsvData={setCsvData} colors={colors} />
        </Box>
        
        <Box sx={{ marginTop: theme.spacing(4) }}>
          <CsvDataList csvData={csvData} theme={theme} />
        </Box>

        <Box sx={{ marginTop: theme.spacing(4) }}>
          <ImportButton csvData={csvData} colors={colors} token={token} />
        </Box>
      </Paper>
    </Container>
  );
};

export default Invoices;