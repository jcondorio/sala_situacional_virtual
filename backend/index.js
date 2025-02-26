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

    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002","http://172.30.135.94:3000","http://172.30.135.94:3001"],
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
app.use("/api/user", require("./src/routes/userRoutes"));


app.listen(port,"0.0.0.0", () => {
    //console.log(`Server is running on port: ${port}`);
});
