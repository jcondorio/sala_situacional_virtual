import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
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
import MyGroupedBarChart from "../../prototips/MyGroupedBarChart";
import MapaTacnaConProvincias10k from "../../components/MapaTacnaConProvincias10k";

const Dashboard = () => {
  const data123 = [
    {
      year: "2023",
      W01: 150,
      W02: 200,
      W03: 180,
      W04: 0,
      W05: 150,
      W06: 200,
      W07: 180,
      W08: 0,
      W09: 150,
      W10: 200,
      W11: 180,
      W12: 11,
    },
    {
      year: "2024",
      W01: 220,
      W02: 250,
      W03: 230,
      W04: 230,
      W05: 150,
      W06: 200,
      W07: 180,
      W08: 0,
      W09: 0,
      W10: 0,
      W11: 0,
      W12: 0,
    },
    // más datos...
  ];

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [dataInsidencias, setDataInsidencias] = useState();
  const [dataUltimaSemana, setDataUltimaSemana] = useState();
  const [totIras, setTotIras] = useState();
  const [totIrasSem, setTotIrasSem] = useState();
  const [totIrasEstSem, setTotIrasEstSem] = useState();
  const [totIrasDistSem, setTotIrasDistSem] = useState();
  const [totEst2024, setTotEst2024] = useState();
  const [dataTotEst, setDataTot2024] = useState();
  const [dataCurvEpi, setDataCurvEpi] = useState();
  const [anniosIras, setAnniosIras] = useState();
  const [annio, setAnnio] = useState();
  const [semana, setSemana] = useState();
  const [semanadistrit, setSemanadistrit] = useState();
  const [estGrafico2, setEstGrafico2] = useState();
  const [distritGrafico4, setDistritGrafico4] = useState();

  const [datosGraf2, setDatosGraf2] = useState();
  const [datosGraf4, setDatosGraf4] = useState();
  const [distritos, setDistritos] = useState();




  const fetchDistritos = async () => {
    try {
      const response = await axios.get(`${API_URL}/edas/distrit`);
      setDistritos(response.data.data);
      console.log("fetchDistritos:", response.data.data);
    } catch (error) {
      console.error("Error fetching estudiantes data:", error);
    }
  };


  const getAnnioIra = async () => {
    try {
      const response = await axios(`${API_URL}/otros/annioEdas`);
      console.log(response.data.data);
      const data = response.data.data;
      setAnniosIras(data);
      // Encontrar el año más alto en los datos
      if (Array.isArray(data) && data.length > 0) {
        const maxYear = Math.max(...data.map(item => item.ANO));
        console.log("getAnnioIra", maxYear)
        setAnnio(maxYear);
      }
    } catch (error) {
      console.error("Error fetching estudiantes data:", error);
    }
  };

  const getTotEst2024 = async () => {
    try {
      const response = await axios.get(`${API_URL}/edas/totest2024`);
      setTotEst2024(response.data.data);
      console.log("getTotEst2024:", response.data.data);
    } catch (error) {
      console.error("Error fetching estudiantes data:", error);
    }
  };

  const transformData = (data) => {
    const result = {};

    data.forEach(({ SEMANA, ANO, Total_IRA }) => {
      if (!result[ANO]) {
        result[ANO] = { year: ANO.toString() };
      }
      result[ANO][SEMANA] = Total_IRA;
    });

    return Object.values(result);
  };

  const getIras = async () => {
    try {
      const response = await axios.get(`${API_URL}/edas`);
      const datoConvertido = transformData(response.data.data);
      console.log("responseirasno:", response.data.data);

      setDataInsidencias(datoConvertido);
      console.log("responseiras:", datoConvertido);
    } catch (error) {
      console.error("Error fetching estudiantes data:", error);
    }
  };
  const getTotIras = async () => {
    try {
      const response = await axios.get(`${API_URL}/edas/totiras`);
      setTotIras(response.data.data.total_registros);
      console.log("getTotIras:", response.data.data.total_registros);
    } catch (error) {
      console.error("Error fetching estudiantes data:", error);
    }
  };
  const getTotIrasSemana = async () => {
    try {
      const response = await axios.get(`${API_URL}/edas/totsemana`);
      setTotIrasSem(response.data.data.total_casos);
      console.log("getTotIrasSemana:", response.data.data);
    } catch (error) {
      console.error("Error fetching estudiantes data:", error);
    }
  };
  const getTotDistritSemana = async () => {
    try {
      const response = await axios.get(`${API_URL}/edas/totdist`);
      setTotIrasDistSem(response.data.data);
      console.log("getTotDistritSemana:", response.data.data);
    } catch (error) {
      console.error("Error fetching estudiantes data:", error);
    }
  };
  const getTotEstSemana = async () => {
    try {
      const response = await axios.get(`${API_URL}/edas/totest`);
      setTotIrasEstSem(response.data.data.total_registros);
      console.log("getTotEstSemana123:", response.data.data);
      updateSemanasSelect(response.data.data.max_semana);

    } catch (error) {
      console.error("Error fetching estudiantes data:", error);
    }
  };

  const getUltimaSemanaIras = async () => {
    try {
      const response = await axios.get(`${API_URL}/edas/ultimasemana`);
      setDataUltimaSemana(response.data.data);
      console.log("getUltimaSemanaIras", response.data.data);
    } catch (error) { }
  };

  const curvaEpidemiologica = async () => {
    try {
      console.log("dataTotEst", dataTotEst);
      const response = await axios.get(
        `${API_URL}/edas/establecimientos2024/${dataTotEst}`
      );
      const datoConvertido = transformData(response.data.data);
      console.log("curva", datoConvertido);
      setDataCurvEpi(datoConvertido);
      // console.log("curvaEpidemiologica", response.data.data);
      //console.log("dataCirvaEpi;", dataCurvEpi)
    } catch (error) { }
  };
  const actualizarDatosGenerales = async () => {
    try {
      console.log("actualizarDatosGenerales", dataTotEst);
      const response = await axios.get(
        `${API_URL}/edas/datosgenerales/${annio}`
      );
      //const datoConvertido = transformData(response.data.data);
      console.log("actualizarDatosGenerales", response.data.data);
      setTotIrasSem(response.data.data.totUltSemana);
      setTotIrasEstSem(response.data.data.totEstUltSem);
      setTotIrasDistSem(response.data.data.totDistUltSem);
      setTotIras(response.data.data.totiras);
      updateSemanasSelect(response.data.data.cantidadSemanas);
      //setDataCurvEpi(datoConvertido);
    } catch (error) { }
  };
  const [semanas, setSemanas] = useState();
  const updateSemanasSelect = (ult_sem) => {
    console.log("ult_sem".ult_sem);
    const semana = [];
    for (let i = 1; i <= ult_sem; i++) {
      semana.push({ semana: i });
    }
    setSemanas(semana);
    setSemana(ult_sem);
    console.log("semana: ", semana);
  };
  const actualizarCasosDistrit = async () => {
    try {
      const result = await axios.get(`${API_URL}/edas/casoDistrit/${annio}`);
      console.log("actualizarCasosDistrit:", result.data.data);
      setDataUltimaSemana(result.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  const casosDistritoSemana = async () => {
    try {
      console.log("casosDistritoSemana", annio, "--", semana)
      const response = await axios.get(`${API_URL}/edas/casesemanadistrit/${annio}/${semanadistrit}`);
      const result = await axios.get(`${API_URL}/edas/updatedistritSem/${annio}/${semanadistrit}`);
      console.log("actualizarCasosDistrit:", response.data.data);
      console.log("actualizarCasosDistrit2:", result.data.data);
      setDataUltimaSemana(result.data.data);
      setTotIrasSem(response.data.data.totUltSemana);
      setTotIrasEstSem(response.data.data.totEstUltSem);
      setTotIrasDistSem(response.data.data.totDistUltSem);
      setSemana(semanadistrit);
    } catch (error) {
      console.error(error);
    }
  };

  const getDataGrafSemana = async () => {
    try {
      console.log("getDataGrafSemana",annio,"---",estGrafico2)
      const response = await axios.get(`${API_URL}/edas/grafico2/${annio}/${estGrafico2}`);
      console.log(response.data.data);
      setDatosGraf2(response.data.data);
    } catch (error) {
      console.error(error)
    }

  };
  const getDataGraf4Semana = async () => {
    try {
      console.log("getDataGraf4Semana",annio,"---",distritGrafico4)
      const response = await axios.get(`${API_URL}/edas/grafico4/${annio}/${distritGrafico4}`);
      console.log(response.data.data);
      setDatosGraf4(response.data.data);
    } catch (error) {
      console.error(error)
    }

  };
  useEffect(() => {
    getIras();
    getUltimaSemanaIras();
    getTotDistritSemana();
    getTotEstSemana();
    getTotIras();
    getTotIrasSemana();
    getTotEst2024();
    getAnnioIra();
    fetchDistritos();
  }, []);
  useEffect(() => {
    actualizarDatosGenerales();
    actualizarCasosDistrit();
    setDatosGraf2("");
    setDatosGraf4("");
  }, [annio]);
  useEffect(() => {
    console.log("dataInsidencias:", dataInsidencias);
  }, [dataInsidencias]);
  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="EDAS D.E.E.P.I. - TACNA" />

       {/* <Box>
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
            Descargar reporte
          </Button>
        </Box>*/}
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        <Box
          gridColumn="span 12"
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
              ></Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Grafico de tendencia en E.D.A.S.
              </Typography>
            </Box>
            <Box>
              <IconButton></IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            {/* <LineChart isDashboard={true} /> */}
            <MyGroupedBarChart data={dataInsidencias} />
            {/*{dataInsidencias && <BarSimpleChart data={dataInsidencias} />} */}
          </Box>
        </Box>
        <Box
          gridColumn="span 12"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
        >
          <Box height="250px" mt="-20px" margin={6}>
            <Grid container>
              <Grid item xs={3}>
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  color={colors.greenAccent[500]}
                >
                  Reporte anual por semanas en Establecimiento
                </Typography>
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={5}>
                <FormControl fullWidth>
                  <InputLabel id="nivel1">Establecimiento</InputLabel>
                  <Select
                    labelId="seccion"
                    label="Sección"
                    value={dataTotEst}
                    onChange={(e) => setDataTot2024(e.target.value)}
                  >
                    <MenuItem value="" disabled></MenuItem>
                    {Array.isArray(totEst2024) &&
                      totEst2024.map((item) => (
                        <MenuItem key={item.COD_EST} value={item.COD_EST}>
                          {item.N_EESS}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={2}>
                <Button
                  onClick={curvaEpidemiologica}
                  variant="contained"
                  color="secondary"
                  style={{ height: "50px" }}
                >
                  Seleccionar
                </Button>
              </Grid>
            </Grid>
            <MyGroupedBarChart data={dataCurvEpi} />
            {/*{dataCurvEpi && <BarSimpleChart data={dataCurvEpi} />}*/}
          </Box>
        </Box>
        {/* ROW 1 */}
        <Box
          paddingTop={5}
          gridColumn="span 12"
          gridRow="span 1"
          backgroundColor={colors.primary[400]}
        >
          <Grid
            container
            item
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel id="annio">Año a analizar</InputLabel>
                <Select
                  labelId="annio"
                  label="annio"
                  value={annio}
                  onChange={(e) => setAnnio(e.target.value)}
                >
                  <MenuItem value="" disabled></MenuItem>
                  {Array.isArray(anniosIras) &&
                    anniosIras.map((item) => (
                      <MenuItem key={item.ANO} value={item.ANO}>
                        {item.ANO}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
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
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12}>
              <Typography
                color={colors.greenAccent[500]}
                variant="h5"
                fontWeight="600"
                textAlign="center"
                sx={{ animation: "fadeIn 1s" }}
              >
                casos totales E.D.A.S. en el año {annio}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                color="textPrimary"
                textAlign="center"
                sx={{
                  animation: "fadeIn 2s",
                  fontSize: "2rem",
                  fontWeight: "bold",
                }}
              >
                {totIras !== null ? totIras : "Cargando..."}
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
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12}>
              <Typography
                color={colors.greenAccent[500]}
                variant="h5"
                fontWeight="600"
                textAlign="center"
                sx={{ animation: "fadeIn 1s" }}
              >
                Casos total E.D.A.S. en la semana {semana} del año {annio}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                color="textPrimary"
                textAlign="center"
                sx={{
                  animation: "fadeIn 2s",
                  fontSize: "2rem",
                  fontWeight: "bold",
                }}
              >
                {totIrasSem !== null ? totIrasSem : "Cargando..."}
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
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12}>
              <Typography
                color={colors.greenAccent[500]}
                variant="h5"
                fontWeight="600"
                textAlign="center"
                sx={{ animation: "fadeIn 1s" }}
              >
                Cantidad de Distritos que presentaron E.D.A.S. en la semana {semana} del año {annio}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                color="textPrimary"
                textAlign="center"
                sx={{
                  animation: "fadeIn 2s",
                  fontSize: "2rem",
                  fontWeight: "bold",
                }}
              >
                {totIrasDistSem !== null ? totIrasDistSem : "Cargando..."}
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
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12}>
              <Typography
                color={colors.greenAccent[500]}
                variant="h5"
                fontWeight="600"
                textAlign="center"
                sx={{ animation: "fadeIn 1s" }}
              >
                Establecimientos con casos de E.D.A.S. en la semana {semana} del año {annio}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                color="textPrimary"
                textAlign="center"
                sx={{
                  animation: "fadeIn 2s",
                  fontSize: "2rem",
                  fontWeight: "bold",
                }}
              >
                {totIrasEstSem !== null ? totIrasEstSem : "Cargando..."}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* ROW 2 */}

        <Box
          gridColumn="span 4"
          gridRow="span 3"
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
            <Grid container justifyContent="center">
              <Grid xs={12}>
                <Typography
                  color={colors.grey[100]}
                  variant="h5"
                  fontWeight="600"
                  align="center"
                  padding={2}
                >
                  Casos por distrito en la semana {semana} del año {annio}
                </Typography>
              </Grid>
              <Grid xs={4}>
                <FormControl fullWidth>
                  <InputLabel id="semana">Semana</InputLabel>
                  <Select
                    labelId="semana"
                    label="semana"
                    value={semanas}
                    onChange={(e) => setSemanadistrit(e.target.value)}
                  >
                    <MenuItem value="" disabled></MenuItem>
                    {Array.isArray(semanas) &&
                      semanas.map((item) => (
                        <MenuItem key={item.semana} value={item.semana}>
                          {item.semana}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={1}></Grid>
              <Grid xs={4}>
                <Button
                  onClick={casosDistritoSemana}
                  variant="contained"
                  color="secondary"
                  margin={2}
                  style={{ height: "50px" }}
                >
                  Seleccionar
                </Button>
              </Grid>
            </Grid>
          </Box>
          {dataUltimaSemana &&
            dataUltimaSemana.map((transaction, i) => (
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
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
          padding="30px"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Mapa geográfico por provincias de Tacna
          </Typography>
          <Box
          >
            <MapaTacnaConProvincias annio={annio} semana={semana} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
          padding="30px"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Mapa geográfico por provincias de Tacna
          </Typography>
          <Box
          >
            <MapaTacnaConProvincias10k annio={annio} semana={semana} />
          </Box>
        </Box>
        <Box
          gridColumn="span 6"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          ></Typography>
          <Box height="250px" mt="-20px" padding={5}>
            <Grid container>
              <Grid item xs={3}>
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  color={colors.greenAccent[500]}
                >
                  Reporte semanal por establecimiento en el año {annio}
                </Typography>
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={5}>
                <FormControl fullWidth>
                  <InputLabel id="nivel1">Establecimiento</InputLabel>
                  <Select
                    labelId="seccion"
                    label="Sección"
                    value={dataTotEst}
                    onChange={(e) => setEstGrafico2(e.target.value)}
                  >
                    <MenuItem value="" disabled></MenuItem>
                    {Array.isArray(totEst2024) &&
                      totEst2024.map((item) => (
                        <MenuItem key={item.COD_EST} value={item.COD_EST}>
                          {item.N_EESS}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={2}>
                <Button
                  onClick={getDataGrafSemana}
                  variant="contained"
                  color="secondary"
                  style={{ height: "50px" }}
                >
                  Seleccionar
                </Button>
              </Grid>
            </Grid>
            {/*<MyGroupedBarChart data={dataCurvEpi} />*/}
            {datosGraf2 && <BarSimpleChart data={datosGraf2} />}
          </Box>
        </Box>
        <Box
          gridColumn="span 6"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          ></Typography>
          <Box height="250px" mt="-20px" padding={5}>
            <Grid container>
              <Grid item xs={3}>
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  color={colors.greenAccent[500]}
                >
                  Reporte semanal por distrito en el año {annio}
                </Typography>
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={5}>
                <FormControl fullWidth>
                  <InputLabel id="nivel1">Establecimiento</InputLabel>
                  <Select
                    labelId="seccion"
                    label="Sección"
                    value={dataTotEst}
                    onChange={(e) => setDistritGrafico4(e.target.value)}
                  >
                    <MenuItem value="" disabled></MenuItem>
                    {Array.isArray(distritos) &&
                      distritos.map((item) => (
                        <MenuItem key={item.Distrit} value={item.Distrit}>
                          {item.Distrit}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={2}>
                <Button
                  onClick={getDataGraf4Semana}
                  variant="contained"
                  color="secondary"
                  style={{ height: "50px" }}
                >
                  Seleccionar
                </Button>
              </Grid>
            </Grid>
            {/*<MyGroupedBarChart data={dataCurvEpi} />*/}
            {datosGraf4 && <BarSimpleChart data={datosGraf4} />}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
