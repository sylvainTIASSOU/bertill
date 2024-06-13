const db = require('../helpers/db_helpers');
const helper = require('../helpers/helpers');
const multiparty = require('multiparty');
const fs = require('fs');
const imageSavePath = "./public/img/";

module.exports.controller = (app, io, socket_list) => {
    // CREATE (POST) route to create a new category
    app.get('/api/categories', (req, res) => {
        const query = `
            SELECT 
                c.idcat,  c.imagecat, c.namecat, c.restaurants_id
            FROM 
                categorie c
        `;
    
        db.query(query, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Erreur lors de la récupération des catégories avec les informations sur les restaurants associés.' });
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.json(result);
        });
    });

    // DELETE - Supprimer une catégorie existante
    app.delete('/api/categories/:id', (req, res) => {
        const categoryId = req.params.id;
        const query = `
            DELETE FROM categorie 
            WHERE idcat = ?
        `;
        db.query(query, [categoryId], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Erreur lors de la suppression de la catégorie.' });
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.json({ message: 'Catégorie supprimée avec succès.' });
        });
    });

    // PUT - Mettre à jour une catégorie existante
    app.put('/api/categories/:id', (req, res) => {
        const categoryId = req.params.id;
        const { namecat, imagecat, restaurants_id } = req.body;
        const query = `
            UPDATE categorie
            SET namecat = ?,  imagecat = ?, restaurants_id = ?
            WHERE idcat = ?
        `;
        db.query(query, [namecat, imagecat, restaurants_id, categoryId], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Erreur lors de la mise à jour de la catégorie.' });
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.json({ message: 'Catégorie mise à jour avec succès.' });
        });
    });

    // POST - Créer une nouvelle catégorie
    app.post('/api/categories', (req, res) => {
        const { namecat, imagecat, restaurants_id } = req.body;
        console.log("Data received:", { namecat, imagecat, restaurants_id });
        const query = `
          INSERT INTO categorie (namecat, imagecat, restaurants_id)
          VALUES (?, ?, ?)
        `;
        db.query(query, [namecat, imagecat, restaurants_id], (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la création de la catégorie.' });
            return;
          }
          res.setHeader('Content-Type', 'application/json');
          res.json({ message: 'Catégorie créée avec succès.', id: result.insertId });
        });
      });
    
}
