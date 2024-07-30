const { getAnnioIrasController, getAnnioEdasController, getCheckedIrasController, postDateEndemicoController, getCheckedEdasController, postDateEndemicoEdasController } = require("../controllers/otrosController");

const router = require("express").Router();

router.get("/annioIras",getAnnioIrasController);
router.get("/annioEdas",getAnnioEdasController);
router.get("/checkediras",getCheckedIrasController);
router.post("/postDate",postDateEndemicoController);
router.get("/checkededas",getCheckedEdasController);
router.post("/postDateedas",postDateEndemicoEdasController);
module.exports = router;