const { getPobDistritServices } = require("../services/poblacionServices");
const { loginService } = require("../services/userServices");

const loginController = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const result = await loginService(userName, password);
        res.status(result.status).json(result.response);
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
module.exports = {
    loginController,
};