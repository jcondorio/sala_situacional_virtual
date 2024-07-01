const { getAnnioIrasController, getAnnioEdasController } = require("../controllers/otrosController");

const router = require("express").Router();

router.get("/annioIras",getAnnioIrasController);
router.get("/annioEdas",getAnnioEdasController);

module.exports = router;