const { getPobDistritController, getPobDistritEdasController } = require("../controllers/poblacionController");


const router = require("express").Router();

router.get("/distrit/:annio/:semana",getPobDistritController);
router.get("/distritedas/:annio/:semana",getPobDistritEdasController);



module.exports = router;