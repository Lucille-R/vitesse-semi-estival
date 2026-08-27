import express from "express";
import router from "./router.js";
import "dotenv/config";

const app = express();

app.use(express.json());

app.use('/', router);

app.listen(process.env.PORT, () =>{
    console.log('Serveur lancé sur http://localhost:3000');
})