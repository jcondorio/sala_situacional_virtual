const { getPobDistritController } = require("../controllers/poblacionController");


const router = require("express").Router();

router.get("/distrit/:annio/:semana",getPobDistritController);

module.exports = router;