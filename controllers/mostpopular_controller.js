const db = require('../helpers/db_helpers');
const helper = require('../helpers/helpers');
const multiparty = require('multiparty');
const fs = require('fs');
const imageSavePath = "./public/img/";

module.exports.controller = (app, io, socket_list) => {

    // CREATE (POST) route to create a new item in mostp
    app.post('/api/mostpopular', (req, res) => {
        const { name, rate, rating, type, food_type, image, price, qty, isFav, Description } = req.body;
        db.query('INSERT INTO `mostp` (`name`, `rate`, `rating`, `type`, `food_type`, `image`, `price`, `qty`, `isFav`, `Description`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, rate, rating, type, food_type, image, price, qty, isFav, Description], (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Erreur lors de la création de l\'élément populaire.' });
                    return;
                }
                res.setHeader('Content-Type', 'application/json');
                res.json({ message: 'Élément populaire créé avec succès.' });
            });
    });











    // READ (GET) route to fetch all items from mostp
   app.get('/api/restaurants_with_idmost', (req, res) => {
    db.query(`
    SELECT *
    FROM restaurants
    WHERE idmost IS NOT NULL
    `, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la récupération des restaurants.' });
            return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    });
});
    
    















    // UPDATE (PUT) route to update an item in mostp
    app.put('/api/mostpopular/:id', (req, res) => {
        const itemId = req.params.id;
        const { name, rate, rating, type, food_type, image, price, qty, isFav, Description } = req.body;
        db.query('UPDATE `mostp` SET `name`=?, `rate`=?, `rating`=?, `type`=?, `food_type`=?, `image`=?, `price`=?, `qty`=?, `isFav`=?, `Description`=? WHERE `idm`=?',
            [name, rate, rating, type, food_type, image, price, qty, isFav, Description, itemId], (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'élément populaire.' });
                    return;
                }
                res.setHeader('Content-Type', 'application/json');
                res.json({ message: 'Élément populaire mis à jour avec succès.' });
            });
    });

    // DELETE route to delete an item from mostp
    app.delete('/api/mostpopular/:id', (req, res) => {
        const itemId = req.params.id;

        // Check if the item exists
        db.query('SELECT * FROM `mostp` WHERE `idm`=?', [itemId], (err, item) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Erreur lors de la récupération de l\'élément populaire à supprimer.' });
                return;
            }

            if (item.length === 0) {
                res.status(404).json({ error: 'Élément populaire non trouvé.' });
                return;
            }

            // Delete the item
            db.query('DELETE FROM `mostp` WHERE `idm`=?', [itemId], (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Erreur lors de la suppression de l\'élément populaire.' });
                    return;
                }
                res.setHeader('Content-Type', 'application/json');
                res.json({ message: 'Élément populaire supprimé avec succès.', deletedItem: item[0] });
            });
        });
    });
}
