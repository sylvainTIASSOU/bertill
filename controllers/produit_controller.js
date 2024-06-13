
const db = require('../helpers/db_helpers');
const helper = require('../helpers/helpers');
const multiparty = require('multiparty');
const fs = require('fs');
const imageSavePath = "./public/img/";

module.exports.controller = (app, io, socket_list) => {




    app.get('/api/menu_itemss', (req, res) => {
        const searchQuery = req.params.variable;
    
        // Effectuer une requête à la base de données pour récupérer les éléments du menu
        db.query("SELECT `idp`, `name`, `rate`, `rating`, `type`, `food_type`, `image`, `price`, `qty`, `isFav`, `Description`, `restaurant_id` FROM `produit` WHERE 1", (err, result) => {
            if (err) {
                // Gérer les erreurs de requête
                console.error(err);
                res.status(500).json({ error: 'Erreur lors de la récupération des éléments du menu.' });
                return;
            }
            // Envoyer les éléments du menu au format JSON
            res.setHeader('Content-Type', 'application/json');
            res.json(result);
        });
    });
    












    
    // DELETE - Supprimer un élément du menu existant
    app.delete('/api/menu_itemss/:id', (req, res) => {
        const itemId = req.params.id;
        db.query('DELETE FROM `produit` WHERE `idp` = ?', [itemId], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Erreur lors de la suppression de l\'élément du menu.' });
                return;
            }
            res.json({ message: 'Élément du menu supprimé avec succès.' });
        });
    });
    
    // PUT - Mettre à jour un élément du menu existant
    app.put('/api/menu_itemss/:id', (req, res) => {
        const itemId = req.params.id;
        const updatedItem = req.body;
        db.query('UPDATE `produit` SET ? WHERE `idp` = ?', [updatedItem, itemId], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'élément du menu.' });
                return;
            }
            res.json({ message: 'Élément du menu mis à jour avec succès.' });
        });
    });
    
    // POST - Créer un nouvel élément du menu
    app.post('/api/menu_itemss', (req, res) => {
        const newItem = req.body;
        db.query('INSERT INTO `produit` SET ?', newItem, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Erreur lors de la création de l\'élément du menu.' });
                return;
            }
            res.json({ message: 'Élément du menu créé avec succès.', id: result.insertId });
        });
    });








   

}