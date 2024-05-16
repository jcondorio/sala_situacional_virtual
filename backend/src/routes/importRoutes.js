const router = require("express").Router();

const { importController } = require("../controllers/importController.js");

router.post("/", importController);

module.exports = router;