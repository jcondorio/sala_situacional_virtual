const { loginController } = require("../controllers/userController");

const router = require("express").Router();

router.post("/admin",loginController);

module.exports = router;