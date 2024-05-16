const router = require("express").Router();

const { getIrasSemanasController } = require("../controllers/irasController");

router.get("/", getIrasSemanasController);

module.exports = router;