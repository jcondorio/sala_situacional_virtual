const router = require("express").Router();
const verifyToken = require('../midleware/auth.js');
const { importController, importControlleredas, importControllerPoblacion, importControllerProvicional } = require("../controllers/importController.js");

router.post("/",verifyToken, importController);
router.post("/importedas",verifyToken, importControlleredas);
router.post("/importpoblacion",verifyToken, importControllerPoblacion);
router.post("/importprovicional", verifyToken, importControllerProvicional);

module.exports = router;