const router = require("express").Router();

const { getIrasSemanasController, getIrasUltimaSemanaDistritController, getTotIrasController, getTotIrasSemanaController, getTotDistritosCasosController, getTotEstCasosController, getTotalEstController, getTotSemIrasEstController } = require("../controllers/irasController");

router.get("/", getIrasSemanasController);
router.get("/ultimasemana", getIrasUltimaSemanaDistritController);
router.get("/totiras", getTotIrasController);
router.get("/totsemana", getTotIrasSemanaController);
router.get("/totdist", getTotDistritosCasosController);
router.get("/totest", getTotEstCasosController);
router.get("/totest2024",getTotalEstController);
router.get("/establecimientos2024/:id",getTotSemIrasEstController);
module.exports = router;