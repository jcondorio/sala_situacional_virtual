import React, { useState } from "react";
import { Box, Container, Paper, Typography, CheckboxItem, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Header from "../global/Header";
import CsvReader from "../../Hooks/CsvReader";
import CsvDataList from "../../Hooks/CsvDataList";
import ImportButton from "../../components/common/ImportButton";
import { tokens } from "../../theme";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { getAnniosIras, postDateService } from "../../services/irasService";
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
  //

  const [datachecked, setDataChecked] = useState([]);

  const getAnniosIra = async () => {
    try {
      const data = await getAnniosIras();
      console.log("getAnnioIra", data);
      setChecked(data);

      const dataTrue = data.filter(item => item.estado === 1);
      console.log("dataTrue", dataTrue.map(item => String(item.ano)));

      setDataChecked(dataTrue.map(item => String(item.ano)));
    } catch (error) {
      console.error("Error al traer los datos", error);
    }
  };
  const handleCheckedIras = (event) => {
    const { value, checked } = event.target;
    console.log(value, checked)
    if (checked) {
      setDataChecked([...datachecked, value]);
    }
    else {
      setDataChecked(datachecked.filter(item => item !== value));
    }
    console.log(datachecked);
  };
  const postDateCanalEndemico = async () => {
    try {
      console.log("datachecked: ", datachecked);
      const response = await postDateService(datachecked);
      setDataChecked(response);
    } catch (error) {
      console.error("error: ", error)
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
        <Header
          title="Años a considerar para el canal endemico en I.R.A.S y Neumonias"
          subtitle="Seleccione los años que se consideraran"
        />

        <Box>
          {Array.isArray(checked) &&
            checked.map((item) => (
              <FormControlLabel key={item.ano} control={<Checkbox defaultChecked={item.estado} value={item.ano} onChange={handleCheckedIras} />} label={item.ano} />
            ))}
        </Box>
        <Box>
          <Button 
          variant="contained"
          sx={{ backgroundColor: colors.primary[600], color: colors.grey[100] }}
          onClick={postDateCanalEndemico}>
            Enviar
          </Button>
        </Box>


      </Paper>
    </Container>
  );
};

export default Team;
