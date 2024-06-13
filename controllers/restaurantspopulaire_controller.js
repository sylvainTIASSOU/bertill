const db = require('../helpers/db_helpers');
const helper = require('../helpers/helpers');
const multiparty = require('multiparty');
const fs = require('fs');
const imageSavePath = "./public/img/";

module.exports.controller = (app, io, socket_list) => {
    // CREATE (POST) route to create a new popular restaurant
  

    // READ (GET) route to fetch all popular restaurants
    app.get('/api/popular', (req, res) => {
        db.query(`
        SELECT *
        FROM restaurants
        WHERE popularcat_id IS NOT NULL
        `, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Erreur lors de la récupération des restaurants populaires.' });
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.json(result);
        });
    });
    
    
    

    app.put('/api/popular/:id', (req, res) => {
        const { id } = req.params;
        const { /* Les champs à mettre à jour */ } = req.body;
    
        db.query(`
            UPDATE restaurants
            SET /* Les champs à mettre à jour */
            WHERE id = ?
        `, [id, /* Les valeurs à mettre à jour */], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Erreur lors de la mise à jour du restaurant populaire.' });
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.json({ message: 'Restaurant populaire mis à jour avec succès.' });
        });
    });
    
    app.delete('/api/popular/:id', (req, res) => {
        const { id } = req.params;
    
        db.query(`
            DELETE FROM restaurants
            WHERE id = ?
        `, [id], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Erreur lors de la suppression du restaurant populaire.' });
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.json({ message: 'Restaurant populaire supprimé avec succès.' });
        });
    });
    
    
    app.post('/api/popular', (req, res) => {
        const { /* Les champs nécessaires pour créer un nouveau restaurant populaire */ } = req.body;
    
        db.query(`
            INSERT INTO restaurants (/* Les champs */)
            VALUES (/* Les valeurs */)
        `, [/* Les valeurs */], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Erreur lors de la création du restaurant populaire.' });
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.json({ message: 'Restaurant populaire créé avec succès.' });
        });
    });
    


    

}
