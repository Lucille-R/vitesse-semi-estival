import express from "express";
import { pool } from "./db.js";


const router = express.Router();

router.get('/', async (req, res) => {
    console.log("La route est fonctionnelle");
})

export default router;