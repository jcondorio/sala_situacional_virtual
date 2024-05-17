const router = require("express").Router();

const { getIrasSemanasController, getIrasUltimaSemanaDistritController, getTotIrasController, getTotIrasSemanaController, getTotDistritosCasosController, getTotEstCasosController } = require("../controllers/irasController");

router.get("/", getIrasSemanasController);
router.get("/ultimasemana", getIrasUltimaSemanaDistritController);
router.get("/totiras", getTotIrasController);
router.get("/totsemana", getTotIrasSemanaController);
router.get("/totdist", getTotDistritosCasosController);
router.get("/totest", getTotEstCasosController);

module.exports = router;