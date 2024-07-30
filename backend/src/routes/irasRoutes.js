const router = require("express").Router();

const { getIrasSemanasController, getIrasUltimaSemanaDistritController, getgrafico2Controller, getcasesemanadistritController, getTotIrasController, getTotIrasSemanaController, getTotDistritosCasosController, getTotEstCasosController, getTotalEstController, getTotSemIrasEstController, getDataDistritController, getDatosGeneralesController, getCasosDistritUltController, getCasosDistritUltSemController, getgrafico4Controller, endemicoIrasController, getAnnioIrasController, distritoonemapController } = require("../controllers/irasController");
const { getCasosDistritUltSemServices } = require("../services/irasServices");

router.get("/", getIrasSemanasController);
router.get("/ultimasemana", getIrasUltimaSemanaDistritController);
router.get("/totiras", getTotIrasController);
router.get("/totsemana", getTotIrasSemanaController);
router.get("/totdist", getTotDistritosCasosController);
router.get("/totest", getTotEstCasosController);
router.get("/totest2024",getTotalEstController);
router.get("/distrit",getDataDistritController);
router.get("/establecimientos2024/:id",getTotSemIrasEstController);
router.get("/datosgenerales/:annio",getDatosGeneralesController);
router.get("/casoDistrit/:annio",getCasosDistritUltController);
router.get("/casesemanadistrit/:annio/:semana",getcasesemanadistritController);
router.get("/updatedistritSem/:annio/:semana",getCasosDistritUltSemController);
router.get("/grafico2/:annio/:estacion",getgrafico2Controller);
router.get("/grafico4/:annio/:distrito",getgrafico4Controller);
router.get("/endemico/:annio",endemicoIrasController);
router.get("/semannioiras/:annio",getAnnioIrasController);
router.get("/distritoonemap",distritoonemapController);
module.exports = router;