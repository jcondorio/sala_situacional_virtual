const { getAnnioIrasController } = require("../controllers/otrosController");

const router = require("express").Router();

router.get("/annioIras",getAnnioIrasController);

module.exports = router;