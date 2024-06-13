
const db = require('../helpers/db_helpers');
const helper = require('../helpers/helpers');
const multiparty = require('multiparty');
const fs = require('fs');
const imageSavePath = "./public/img/";

module.exports.controller = (app, io, socket_list) => {
    app.get('/api/recent_items', (req, res) => {
        db.query(`
        SELECT *
        FROM restaurants
        WHERE idre IS NOT NULL
        `, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Erreur lors de la récupération des éléments récents.' });
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.json(result);
        });
    });
    
    












   





}