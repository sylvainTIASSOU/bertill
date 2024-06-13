

const db = require('../helpers/db_helpers');
const helper = require('../helpers/helpers');
const multiparty = require('multiparty');
const fs = require('fs');
const imageSavePath = "./public/img/";

module.exports.controller = (app, io, socket_list) => {
    // CREATE (POST) route to create a new restaurant
    app.get('/api/restaurants', (req, res) => {
        const query = `
        SELECT 
            r.id, r.name, r.address, r.phone, r.email, r.created_at, r.produit_id, r.popularcat_id, r.idcaté, r.imager,
            r.rate, r.rating, r.type, r.food_type, r.qty, r.isFav, r.Description, r.minimum_purchase, r.delivery_cost, r.idmost, r.idre,
            c.idcat, c.imagecat, c.namecat, c.restaurants_id
        FROM 
            restaurants r
        LEFT JOIN 
            categorie c ON r.idcaté = c.idcat
        `;
        
        db.query(query, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Erreur lors de la récupération des restaurants avec les informations sur les catégories associées.' });
                return;

            }
            res.setHeader('Content-Type', 'application/json');
            res.json(result);
        });
    });
    
    
    app.post('/api/restaurants', (req, res) => {
        const {
            name, address, phone, email, produit_id, popularcat_id, idcaté, imager,
            rate, rating, type, food_type, qty, isFav, Description, minimum_purchase, delivery_cost, idmost, idre
        } = req.body;
        console.log("Data received:", { name, address, phone, email, produit_id, popularcat_id, idcaté, imager,
            rate, rating, type, food_type, qty, isFav, Description, minimum_purchase, delivery_cost, idmost, idre });
        const query = `
            INSERT INTO restaurants (
                name, address, phone, email, produit_id, popularcat_id, idcaté, imager,
                rate, rating, type, food_type, qty, isFav, Description, minimum_purchase, delivery_cost, idmost, idre
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
    
        db.query(query, [
            name, address, phone, email, produit_id, popularcat_id, idcaté, imager,
            rate, rating, type, food_type, qty, isFav, Description, minimum_purchase, delivery_cost, idmost, idre
        ], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Erreur lors de la création du restaurant.' });
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json({ message: 'Restaurant créé avec succès.', id: result.insertId });
        });
    });
    




    app.put('/api/restaurants/:id', (req, res) => {
        const {
            name, address, phone, email, produit_id, popularcat_id, idcaté, imager,
            rate, rating, type, food_type, qty, isFav, Description, minimum_purchase, delivery_cost, idmost, idre
        } = req.body;
        const { id } = req.params;
    
        
        const query = `
            UPDATE restaurants SET
                name = ?, address = ?, phone = ?, email = ?, produit_id = ?, popularcat_id = ?, idcaté = ?, imager = ?,
                rate = ?, rating = ?, type = ?, food_type = ?, qty = ?, isFav = ?, Description = ?, minimum_purchase = ?, delivery_cost = ?, idmost = ?, idre = ?
            WHERE id = ?
        `;
    
        db.query(query, [
            name, address, phone, email, produit_id, popularcat_id, idcaté, imager,
            rate, rating, type, food_type, qty, isFav, Description, minimum_purchase, delivery_cost, idmost, idre, id
        ], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Erreur lors de la mise à jour du restaurant.' });
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.json({ message: 'Restaurant mis à jour avec succès.' });
        });
    });
    
    app.delete('/api/restaurants/:id', (req, res) => {
        const { id } = req.params;
    
        const query = `
            DELETE FROM restaurants WHERE id = ?
        `;
    
        db.query(query, [id], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Erreur lors de la suppression du restaurant.' });
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.json({ message: 'Restaurant supprimé avec succès.' });
        });
    });
    



    app.post('/api/restaurants/:id/favorite', (req, res) => {
        const { id } = req.params;
        
        const query = `
            UPDATE restaurants SET isFav = 1 WHERE id = ?
        `;
        
        db.query(query, [id], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Erreur lors de l'ajout du restaurant aux favoris." });
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.json({ message: 'Restaurant ajouté aux favoris avec succès.' });
        });
    });
    
    app.post('/api/restaurants/:id/unfavorite', (req, res) => {
        const { id } = req.params;
        
        const query = `
            UPDATE restaurants SET isFav = 0 WHERE id = ?
        `;
        
        db.query(query, [id], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Erreur lors de la suppression du restaurant des favoris." });
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.json({ message: 'Restaurant supprimé des favoris avec succès.' });
        });
    });
    





}