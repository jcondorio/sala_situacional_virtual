const { getAnnioIrasController, getAnnioEdasController, getCheckedIrasController } = require("../controllers/otrosController");

const router = require("express").Router();

router.get("/annioIras",getAnnioIrasController);
router.get("/annioEdas",getAnnioEdasController);
router.get("/checkediras",getCheckedIrasController)

module.exports = router;