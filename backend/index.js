const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors({
    //origin: ["https://diresa-real-1.onrender.com"],

    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002","http://10.128.133.155:3000"],
    credentials: true,
    optionSuccessStatus: 200,
    headers: true, 
    exposedHeaders: 'Set-Cookie',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Access-Control-Allow-Origin',
        'Content-Type',
        'Authorization'
    ]
}));

app.use("/api/import", require("./src/routes/importRoutes"));
app.use("/api/iras",require("./src/routes/irasRoutes"));
app.use("/api/edas",require("./src/routes/edasRoutes"));
app.use("/api/otros",require("./src/routes/otrosRoutes"));
app.use("/api/poblacion",require("./src/routes/poblacionRoutes"));
app.use("/api/login",require("./src/routes/userRoutes"));
app.use("/api/neu",require("./src/routes/neuRoutes"));


app.listen(port,"0.0.0.0", () => {
    //console.log(`Server is running on port: ${port}`);
});
