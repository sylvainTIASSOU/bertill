const db = require('../helpers/db_helpers');

module.exports.controller = (app, io, socket_list) => {
    // CREATE (POST) route to create a new order
  
// app.post('/api/orders', (req, res) => {
//     console.log('Requête reçue pour créer une commande');
//     console.log('Données de la commande reçues :', req.body);
  
//     const { user_id, restaurant_id, total_amount, status, items } = req.body;
  
//     db.beginTransaction((err) => {
//       if (err) {
//         console.error('Erreur lors du démarrage de la transaction :', err);
//         res.status(500).json({ error: 'Erreur lors du démarrage de la transaction.' });
//         return;
//       }
  
//       db.query('INSERT INTO `orders` (`user_id`, `restaurant_id`, `total_amount`, `status`, `created_at`) VALUES (?, ?, ?, ?, NOW())',
//         [user_id, restaurant_id, total_amount, status], (err, result) => {
//           if (err) {
//             console.error('Erreur lors de la création de la commande :', err);
//             return db.rollback(() => {
//               res.status(500).json({ error: 'Erreur lors de la création de la commande.' });
//             });
//           }
  
//           const orderId = result.insertId;
//           const orderItemsQueries = items.map(item => {
//             return new Promise((resolve, reject) => {
//               db.query('INSERT INTO `order_items` (`order_id`, `produit_id`, `quantity`, `price`) VALUES (?, ?, ?, ?)',
//                 [orderId, item.produit_id, item.quantity, item.price], (err, result) => {
//                   if (err) {
//                     console.error(`Erreur lors de la création de l'élément de commande pour produit_id ${item.produit_id} :`, err);
//                     reject(err);
//                   } else {
//                     resolve(result);
//                   }
//                 });
//             });
//           });
  
//           Promise.all(orderItemsQueries)
//             .then(() => {
//               db.commit((err) => {
//                 if (err) {
//                   console.error('Erreur lors de la validation de la transaction :', err);
//                   return db.rollback(() => {
//                     res.status(500).json({ error: 'Erreur lors de la validation de la transaction.' });
//                   });
//                 }
//                 console.log('Commande et éléments de commande créés avec succès');
//                 res.json({ message: 'Commande créée avec succès' });
//               });
//             })
//             .catch(err => {
//               console.error('Erreur lors de la création des éléments de commande :', err);
//               db.rollback(() => {
//                 res.status(500).json({ error: 'Erreur lors de la création des éléments de commande.' });
//               });
//             });
//         });
//     });
//   });

app.post('/api/orders', (req, res) => {
    console.log('Requête reçue pour créer une commande');
    console.log('Données de la commande reçues :', req.body);
  
    const { user_id, restaurant_id, total_amount, status, items } = req.body;
  
    db.query('INSERT INTO `orders` (`user_id`, `restaurant_id`, `total_amount`, `status`, `created_at`) VALUES (?, ?, ?, ?, NOW())',
      [user_id, restaurant_id, total_amount, status], (err, result) => {
        if (err) {
          console.error('Erreur lors de la création de la commande :', err);
          return res.status(500).json({ error: 'Erreur lors de la création de la commande.' });
        }

        const orderId = result.insertId;
        const orderItemsQueries = items.map(item => {
          return new Promise((resolve, reject) => {
            db.query('INSERT INTO `order_items` (`order_id`, `produit_id`, `quantity`, `price`) VALUES (?, ?, ?, ?)',
              [orderId, item.produit_id, item.quantity, item.price], (err, result) => {
                if (err) {
                  console.error(`Erreur lors de la création de l'élément de commande pour produit_id ${item.produit_id} :`, err);
                  reject(err);
                } else {
                  resolve(result);
                }
              });
          });
        });

        Promise.all(orderItemsQueries)
          .then(results => {
            res.status(200).json({ message: 'Commande enregistrée avec succès.', orderId: orderId });
          })
          .catch(err => {
            console.error('Erreur lors de l\'insertion des éléments de commande :', err);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ error: 'Erreur lors de l\'insertion des éléments de commande.' });
          });
      });
});





app.get('/api/orders', (req, res) => {
  db.query('SELECT * FROM `orders`', (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des commandes :', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération des commandes.' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(results);
  });
});











  }

  
 

