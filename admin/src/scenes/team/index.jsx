import React, { useState } from "react";
import { Box, Container, Paper, Typography, CheckboxItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Header from "../global/Header";
import CsvReader from "../../Hooks/CsvReader";
import CsvDataList from "../../Hooks/CsvDataList";
import ImportButton from "../../components/common/ImportButton";
import { tokens } from "../../theme";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { getAnniosIras } from "../../services/irasService";
import { useEffect } from "react";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [csvData, setCsvData] = useState(null);
  const token = localStorage.getItem("token");

  const [checked, setChecked] = useState({});

  const handleChange = (event) => {
    setChecked({
      ...checked,
      [event.target.name]: event.target.checked,
    });
  };

  const getAnniosIra = async () => {
    try {
      const data = getAnniosIras();
      setChecked(data);
      console.log("getAnnioIra", data);
    } catch (error) {
      console.error("Error al traer los datos");
    }
  };
  useEffect(() => {
    getAnniosIra();
  }, []);

  return (
    <Container maxWidth="md">
      <Paper
        elevation={3}
        sx={{ padding: theme.spacing(4), marginTop: theme.spacing(4) }}
      >
        <Header
          title="Importar Datos de I.R.A.S."
          subtitle="Sube un archivo CSV para importar los datos del equipo"
        />

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
      <Paper
        elevation={3}
        sx={{ padding: theme.spacing(4), marginTop: theme.spacing(4) }}
      >
        <FormControl component="fieldset">
          <FormLabel component="legend">Selecciona opciones</FormLabel>
          <FormGroup>
            {checked.length === 0 ? (
              <Typography>No hay opciones disponibles.</Typography>
            ) : (
              checked.map((item) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={item.ANO}
                     // onChange={() => onChange(item)}
                    />
                  }
                  label={item.label}
                />
              ))
            )}
          </FormGroup>
        </FormControl>
      </Paper>
    </Container>
  );
};

export default Team;
