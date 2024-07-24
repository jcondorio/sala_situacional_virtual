const { getAnnioIrasController, getAnnioEdasController, getCheckedIrasController, postDateEndemicoController } = require("../controllers/otrosController");

const router = require("express").Router();

router.get("/annioIras",getAnnioIrasController);
router.get("/annioEdas",getAnnioEdasController);
router.get("/checkediras",getCheckedIrasController);
router.post("/postDate",postDateEndemicoController);

module.exports = router;