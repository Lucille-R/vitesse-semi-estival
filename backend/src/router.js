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

router.get('/produits', async (req, res) => {
    const { rows } = await pool.query(`SELECT * FROM produits`);

    res.json(rows);
})

router.post('/vente', async(req, res) => {
    const maVente = req.body;

    const now = new Date();
    const dateJour = now.toISOString().slice(0, 10);
    const heure = now.toTimeString().slice(0,8);

    const { rows } = await pool.query(`INSERT INTO ventes (date, heure, vendeur_id) VALUES ($1, $2, $3) RETURNING *`, [dateJour, heure, maVente.vendeurId]);

    const monID = rows[0].id;
    const monPanier = maVente.lignes;

    for (const a of monPanier) {
        await pool.query(`INSERT INTO ventes_lignes (vente_id, produit_id, quantite) VALUES ($1, $2, $3)`, [monID, a.produitId, a.quantite]);
    }

    res.json({"vente":rows[0]});
})

export default router;