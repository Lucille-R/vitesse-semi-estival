import express from "express";
import { pool } from "./db.js";


const router = express.Router();

router.get('/', async (req, res) => {
    console.log("La route est fonctionnelle");
});



router.get('/vendeur', async (req, res) => {
    const codeDonne = req.query.code;

    if(codeDonne){
        const { rows } = await pool.query(`SELECT * FROM vendeurs WHERE numero_vendeur = $1`, [codeDonne]);

        if(rows[0] == undefined){
            res.status(404).json({"statut":"Vendeur inexistant"});
        }
        else {
            res.json(rows[0]);
        }
    }
    res.status(400).json({"statut":"Aucun code vendeur fourni"});
    
})

export default router;