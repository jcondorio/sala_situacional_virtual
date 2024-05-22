import { Box, Button, IconButton, Typography, useTheme, Grid } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import MapaTacnaConProvincias from "../../components/MapaTacnaConProvincias";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../../auth/contacts";
import BarSimpleChart from "../../components/BarSimpleChart";
import MyResponsiveStream from "../../components/MyResponsiveStream";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [dataInsidencias, setDataInsidencias] = useState();
  const [dataUltimaSemana, setDataUltimaSemana] = useState();
  const [totIras, setTotIras] = useState();
  const [totIrasSem, setTotIrasSem] = useState();
  const [totIrasEstSem, setTotIrasEstSem] = useState();
  const [totIrasDistSem, setTotIrasDistSem] = useState();

  const getIras = async () => {
    try {
      const response = await axios.get(`${API_URL}/iras`);
      setDataInsidencias(response.data.data);
      console.log("response:", response.data.data);
    } catch (error) {
      console.error("Error fetching estudiantes data:", error);
    }
  };
  const getTotIras = async () => {
    try {
      const response = await axios.get(`${API_URL}/iras/totiras`);
      setTotIras(response.data.data.total_registros);
      console.log("getTotIras:", response.data.data.total_registros);
    } catch (error) {
      console.error("Error fetching estudiantes data:", error);
    }
  };
  const getTotIrasSemana = async () => {
    try {
      const response = await axios.get(`${API_URL}/iras/totsemana`);
      setTotIrasSem(response.data.data.total_casos);
      console.log("getTotIrasSemana:", response.data.data.total_casos);
    } catch (error) {
      console.error("Error fetching estudiantes data:", error);
    }
  };
  const getTotDistritSemana = async () => {
    try {
      const response = await axios.get(`${API_URL}/iras/totdist`);
      setTotIrasEstSem(response.data.data);
      console.log("getTotDistritSemana:", response.data.data);
    } catch (error) {
      console.error("Error fetching estudiantes data:", error);
    }
  };
  const getTotEstSemana = async () => {
    try {
      const response = await axios.get(`${API_URL}/iras/totest`);
      setTotIrasDistSem(response.data.data);
      console.log("getTotEstSemana:", response.data.data);
    } catch (error) {
      console.error("Error fetching estudiantes data:", error);
    }
  };

  const getUltimaSemanaIras = async () => {
    try {
      const response = await axios.get(`${API_URL}/iras/ultimasemana`);
      setDataUltimaSemana(response.data.data);
      console.log("getUltimaSemanaIras", response.data.data)
    } catch (error) {

    }
  };

  useEffect(() => {
    getIras();
    getUltimaSemanaIras();
    getTotDistritSemana();
    getTotEstSemana();
    getTotIras();
    getTotIrasSemana();
  }, []);
  useEffect(() => {
    console.log("dataInsidencias:", dataInsidencias);
  }, [dataInsidencias]);
  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12}>
              <Typography
                color={colors.greenAccent[500]}
                variant="h5"
                fontWeight="600"
                textAlign="center"
                sx={{ animation: 'fadeIn 1s' }}
              >
                casos totales IRAS
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                color="textPrimary"
                textAlign="center"
                sx={{ animation: 'fadeIn 2s', fontSize: '2rem', fontWeight: 'bold' }}
              >
                {totIras !== null ? totIras : 'Cargando...'}
              </Typography>
            </Grid>
          </Grid>

        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12}>
              <Typography
                color={colors.greenAccent[500]}
                variant="h5"
                fontWeight="600"
                textAlign="center"
                sx={{ animation: 'fadeIn 1s' }}
              >
                Casos total semanal IRAS
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                color="textPrimary"
                textAlign="center"
                sx={{ animation: 'fadeIn 2s', fontSize: '2rem', fontWeight: 'bold' }}
              >
                {totIrasSem !== null ? totIrasSem : 'Cargando...'}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12}>
              <Typography
                color={colors.greenAccent[500]}
                variant="h5"
                fontWeight="600"
                textAlign="center"
                sx={{ animation: 'fadeIn 1s' }}
              >
                Casos totales semanales IRAS Distritales
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                color="textPrimary"
                textAlign="center"
                sx={{ animation: 'fadeIn 2s', fontSize: '2rem', fontWeight: 'bold' }}
              >
                {totIrasDistSem !== null ? totIrasDistSem : 'Cargando...'}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12}>
              <Typography
                color={colors.greenAccent[500]}
                variant="h5"
                fontWeight="600"
                textAlign="center"
                sx={{ animation: 'fadeIn 1s' }}
              >
                Establecimientos con casos de IRAS Semanal
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                color="textPrimary"
                textAlign="center"
                sx={{ animation: 'fadeIn 2s', fontSize: '2rem', fontWeight: 'bold' }}
              >
                {totIrasEstSem !== null ? totIrasEstSem : 'Cargando...'}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Revenue Generated
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                $59,342.32
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            {/* <LineChart isDashboard={true} /> */}
            {dataInsidencias && <BarSimpleChart data={dataInsidencias} />}
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Casos por distrito en la ultima semana
            </Typography>
          </Box>
          {dataUltimaSemana && dataUltimaSemana.map((transaction, i) => (
            <Box
              key={`${transaction.Distrit}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.Dpto}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.Prov}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.Distrit}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                {transaction.total_registros}
              </Box>
            </Box>
          ))}
        </Box>

        {/* ROW 3 */}
        
        <Box
        
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <MyResponsiveStream></MyResponsiveStream>
          <LineChart isDashboard={true} />
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Geography Based Traffic
          </Typography>
          <Box height="200px">
            <MapaTacnaConProvincias></MapaTacnaConProvincias>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
