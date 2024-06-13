



const db = require('../helpers/db_helpers');
const helper = require('../helpers/helpers');
const multiparty = require('multiparty');
const fs = require('fs');
const imageSavePath = "./public/img/";

const msg_success = "successfully";
const msg_fail = "fail";
const msg_invalidUserPassword = "invalid username and password";
const msg_invalidUser = "invalid username and password";

module.exports.controller = (app, io, socket_list) => {
    const msg_exits_email="already exists email address"
    const msg_exits_user = "user not exist";
     const msg_update_password = "user password update";
    app.post('/api/login', (req, res) => {
        helper.Dlog(req.body);
        const reqObj = req.body;

        helper.CheckParameterValid(res, reqObj, ["email", "password", "push_token"], () => {
            getUserWithPasswordData(reqObj.email, reqObj.password, (status, result) => {
                if (status) {
                    var auth_token = helper.createRequestToken();
                    db.query('UPDATE `user_detail` SET `auth_token`=?, `push_token`=? WHERE `user_id`=? AND `status`=?', [
                        auth_token, reqObj.push_token, result.user_id, "1"
                    ], (err, uResult) => {
                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return;
                        }
                        if (uResult.affectedRows > 0) {
                            result.auth_token = auth_token;
                            res.json({ "status": "1", "payload": result, "message": msg_success });
                        
                        } else {
                            res.json({ "status": "0", "message": msg_invalidUserPassword });
                        }
                    });
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ "status": "0", "message": result });
                }
            });
        });
    });


   // admin login
   
   app.get('/api/users', (req, res) => {
    db.query('SELECT `user_id`, `name`, `email`, `mobile`, `adresse`, `image`, `device_type`, `auth_token` FROM `user_detail` WHERE `status`=?', ['1'], (err, result) => {
        if (err) {
            res.json({ "status": "0", "message": msg_fail });
            return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.json({ "status": "1", "payload": result, "message": "Users retrieved successfully" });
    });
});


// DELETE - Supprimer un utilisateur existant
app.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    db.query('DELETE FROM `user_detail` WHERE `user_id` = ?', [userId], (err, result) => {
        if (err) {
            res.json({ "status": "0", "message": "Erreur lors de la suppression de l'utilisateur." });
            return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.json({ "status": "1", "message": "Utilisateur supprimé avec succès." });
    });
});

// PUT - Mettre à jour un utilisateur existant
app.put('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const userData = req.body;
    db.query('UPDATE `user_detail` SET ? WHERE `user_id` = ?', [userData, userId], (err, result) => {
        if (err) {
            res.json({ "status": "0", "message": "Erreur lors de la mise à jour de l'utilisateur." });
            return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.json({ "status": "1", "message": "Utilisateur mis à jour avec succès." });
    });
});

// POST - Créer un nouvel utilisateur
app.post('/api/users', (req, res) => {
    const userData = req.body;
    db.query('INSERT INTO `user_detail` SET ?', userData, (err, result) => {
        if (err) {
            res.json({ "status": "0", "message": "Erreur lors de la création de l'utilisateur." });
            return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.json({ "status": "1", "message": "Utilisateur créé avec succès.", "user_id": result.insertId });
    });
});







      


    // sign_up

    app.post('/api/sign_up', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;
    
        helper.CheckParameterValid(res, reqObj, ["name", "email","mobile",  "adresse", "password", "push_token", "device_type"], () => {
            
            db.query('SELECT `user_id`, `email` FROM `user_detail` WHERE `email`=?', [reqObj.email], (err, result) => {
                if (err) {
                    helper.ThrowHtmlError(err, res);
                    return;
                }
    
                if (result.length == 0) {
                    var auth_token = helper.createRequestToken();
                    var resetCode = helper.createNumber();
    
                    db.query('INSERT INTO `user_detail`(`name`, `email`, `password`, `mobile`, `adresse` ,`device_type`, `auth_token`, `push_token`, `reset_code`, `created_date`, `update_date`) VALUES(?,?,?,?,?,?,?,?,?,NOW(),NOW())', [
                        reqObj.name, reqObj.email,reqObj.password, reqObj.mobile,  reqObj.adresse, reqObj.device_type, auth_token, reqObj.push_token, resetCode
                    ], (err, iResult) => {
                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return;
                        }
    
                      
    
                        if (iResult) {
                            getUserData(iResult.insertId, (userObj) => {
                                res.json({ "status": "1", "payload": userObj, "message": msg_success });
                            });
                        } else {
                            res.json({ "status": "0", "message": msg_fail });
                        }
                    });
                }else{
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ "status": "0", "message": msg_exits_email });
                } 
            });
        });
    });






















app.get('/api/menu_view/:category_id', (req, res) => {
    const categoryId = req.params.category_id; // Utilisez category_id pour récupérer la valeur de categoryId

    // Effectuer une requête à la base de données pour récupérer les éléments du menu filtrés par catégorie
    db.query('SELECT `id`, `name`, `image`, `items_count`, `restaurant_id` FROM `menu` WHERE idcat = ?', [categoryId], (err, result) => {
        if (err) {
            // Gérer les erreurs de requête
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la récupération du menu filtré par catégorie.' });
            return;
        }
        // Envoyer les éléments du menu filtrés par catégorie au format JSON
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    });
});



app.get('/api/menu', (req, res) => {
    // Effectuer une requête à la base de données pour récupérer tous les éléments du menu
    db.query('SELECT `id`, `name`, `image`, `items_count`, `restaurant_id` FROM `menu`', (err, result) => {
        if (err) {
            // Gérer les erreurs de requête
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la récupération de tous les éléments du menu.' });
            return;
        }
        // Envoyer tous les éléments du menu au format JSON
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    });
});






// app.get('/api/menu_items/:restaurant_id', (req, res) => {
//     const restaurantId = req.params.restaurant_id;
//     // Effectuer une requête à la base de données pour récupérer les éléments du menu du restaurant spécifié
//     db.query("SELECT `idp`, `id_menu`, `name`, `rate`, `rating`, `type`, `food_type`, `image`, `price`, `qty`, `isFav`, `Description`, `restaurant_id` FROM `produit` WHERE `restaurant_id` = ?", [restaurantId], (err, result) => {
//         if (err) {
//             // Gérer les erreurs de requête
//             console.error(err);
//             res.status(500).json({ error: 'Erreur lors de la récupération des éléments du menu.' });
//             return;
//         }
//         // Envoyer les éléments du menu au format JSON
//         res.json(result);
//     });
// });






















app.get('/api/data', (req, res) => {
    // Effectuer une requête à la base de données pour récupérer les éléments du menu
    db.query("SELECT `IdPopCat`, `name`, `rate`, `rating`, `type`, `food_type`, `image`, `price`, `qty`, `isFav` FROM `popularcat` WHERE 1", (err, result) => {
        if (err) {
            // Gérer les erreurs de requête
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la récupération des éléments du menu.' });
            return;
        }
        // Envoyer les éléments du menu au format JSON
        res.json(result);
    });
});




    
    

    app.post('/api/upload_image', (req, res) => {
        const form = new multiparty.Form();
        form.parse(req, (err, reqObj, files) => {
            if (err) {
                helper.ThrowHtmlError(err, res);
                return;
            }

            helper.Dlog("--------------- Parameter --------------");
            helper.Dlog(reqObj);

            helper.Dlog("--------------- Files --------------");
            helper.Dlog(files);

            if (files.image != undefined || files.image != null) {
                const extension = files.image[0].originalFilename.substring(files.image[0].originalFilename.lastIndexOf(".") + 1);
                const imageFileName = helper.fileNameGenerate(extension);
                const newPath = imageSavePath + imageFileName;

                fs.rename(files.image[0].path, newPath, (err) => {
                    if (err) {
                        helper.ThrowHtmlError(err);
                        return;
                    } else {
                        const name = reqObj.name;
                        const address = reqObj.address;

                        helper.Dlog(name);
                        helper.Dlog(address);

                        res.json({
                            "status": "1",
                            "payload": { "name": name, "address": address, "image": helper.ImagePath() + imageFileName },
                            "message": msg_success
                        });
                    }
                });
            }
        });
    });



    app.post('/api/forgot_password_request', (req, res) => {
        helper.Dlog("Request body: ", req.body);
        const reqObj = req.body;
    
        helper.CheckParameterValid(res, reqObj, ["email"], () => {
            db.query("SELECT `user_id`, `email` FROM `user_detail` WHERE `email`=?", [reqObj.email], (err, result) => {
                if (err) {
                    helper.Dlog("Database error: ", err);
                    helper.ThrowHtmlError(err, res);
                    return;
                }
            
                if (result.length > 0) {
                    var resetCode = helper.createNumber();
                    db.query('UPDATE `user_detail` SET `reset_code`=? WHERE `email`=? AND `status`=?', [resetCode, reqObj.email, "1"], (err, uResult) => {
                        if (err) {
                            helper.Dlog("Update error: ", err);
                            helper.ThrowHtmlError(err, res);
                            return;
                        }
    
                        if (uResult.affectedRows > 0) {
                            // Ici, vous pouvez envoyer un email avec le code de réinitialisation
                            // Pour l'instant, nous allons simplement renvoyer le code de réinitialisation
                            res.json({ "status": "1", "payload": { "resetCode": resetCode }, "message": "Password reset code has been sent successfully." });
                        } else {
                            res.json({ "status": "0", "message": "Failed to update reset code." });
                        }
                    });
                } else {
                    res.json({ "status": "0", "message": "Invalid user email." });
                }
            });
        });
    });
    
    app.post('/api/forgot_password_verify', (req, res) => {
        helper.Dlog("Request body: ", req.body);
        const reqObj = req.body;
    
        helper.CheckParameterValid(res, reqObj, ["email","reset_code"], () => {
            db.query("SELECT `user_id`, `email` FROM `user_detail` WHERE `email`=? AND `reset_code`=? ", [reqObj.email,reqObj.reset_code], (err, result) => {

                if (err) {
                    helper.Dlog("Database error: ", err);
                    helper.ThrowHtmlError(err, res);
                    return;
                }
            
                if (result.length > 0) {
                    var restCode = helper.createNumber();
                    db.query('UPDATE `user_detail` SET `reset_code`=? WHERE `email`=? AND `status`=?', [restCode, reqObj.email, "1"], (err, uResult) => {
                        if (err) {
                            helper.Dlog("Update error: ", err);
                            helper.ThrowHtmlError(err, res);
                            return;
                        }
    
                        if (uResult.affectedRows > 0) {
                            // Ici, vous pouvez envoyer un email avec le code de réinitialisation
                            // Pour l'instant, nous allons simplement renvoyer le code de réinitialisation
                            res.json({ "status": "1", "payload": { "user_id": result[0].user_id ,"reset_code":restCode}, "message": "Password reset code has been sent successfully." });
                        } else {
                            res.json({ "status": "0", "message": msg_fail });
                        }
                    });
                } else {
                    res.json({ "status": "0", "message": "Invalid user email." });
                }
            });
        });
    });  

    app.post('/api/forgot_password_set_new', (req, res) => {
        helper.Dlog("Request body: ", req.body);
        const reqObj = req.body;
    
        helper.CheckParameterValid(res, reqObj, ["user_id","reset_code","new_password"], () => {
            var restCode = helper.createNumber();
            db.query("UPDATE`user_detail` SET `password`=?,`reset_code=?`   WHERE `user_id`='2' AND `reset_code` IS NULL AND `status` ", [reqObj.new_password,restCode,reqObj.user_id,reqObj.resetCode,"1"], (err, result) => {
                if (err) {
                    helper.Dlog("Database error: ", err);
                    helper.ThrowHtmlError(err, res);
                    return;
                }
            
                if (result.affectedRows > 0) {
                    res.json({ "status": "1",  "message": msg_update_password });
                 } else {
                        res.json({ "status": "0", "message": msg_fail });
                    }
                       
                    });
                } 
    );
        
    } 
 )







    
    


    app.post('/api/upload_multi_image', (req, res) => {
        const form = new multiparty.Form();
        form.parse(req, (err, reqObj, files) => {
            if (err) {
                helper.ThrowHtmlError(err, res);
                return;
            }

            helper.Dlog("--------------- Parameter --------------");
            helper.Dlog(reqObj);

            helper.Dlog("--------------- Files --------------");
            helper.Dlog(files);

            if (files.image != undefined || files.image != null) {
                const imageNamePathArr = [];
                const fullImageNamePathArr = [];
                files.image.forEach(imageFile => {
                    const extension = imageFile.originalFilename.substring(imageFile.originalFilename.lastIndexOf(".") + 1);
                    const imageFileName = helper.fileNameGenerate(extension);

                    imageNamePathArr.push(imageFileName);
                    fullImageNamePathArr.push(helper.ImagePath() + imageFileName);
                    saveImage(imageFile, imageSavePath + imageFileName);
                });

                helper.Dlog(imageNamePathArr);
                helper.Dlog(fullImageNamePathArr);

                const name = reqObj.name;
                const address = reqObj.address;

                helper.Dlog(name);
                helper.Dlog(address);

                res.json({
                    "status": "1",
                    "payload": { "name": name, "address": address, "image": fullImageNamePathArr },
                    "message": msg_success
                });
            }
        });
    });
};

function saveImage(imageFile, savePath) {
    fs.rename(imageFile.path, savePath, (err) => {
        if (err) {
            helper.ThrowHtmlError(err);
            return;
        }
    });
}

function getUserData(user_id, callback) {
    db.query('SELECT `user_id`, `name`, `email`, `password`, `mobile`, `adresse`, `image`, `device_type`, `auth_token` FROM `user_detail` WHERE `user_id`=? AND `status`=?', [user_id, '1'], (err, result) => {
        if (err) {
            helper.ThrowHtmlError(err);
            return callback(false, msg_fail);
        }
        if (result.length > 0) {
            return callback(result[0]);
        } 
    });
}

function getUserWithPasswordData(email, password, callback) {
    db.query('SELECT `user_id`, `name`, `email`, `password`, `mobile`, `adresse`, `image`, `device_type`, `auth_token` FROM `user_detail` WHERE `email`=? AND `status`=? AND `password`=?', [email, '1', password], (err, result) => {
        if (err) {
            helper.ThrowHtmlError(err);
            return callback(false, msg_fail);
        }
        if (result.length > 0) {
            return callback(true, result[0]);
        } else {
            return callback(false, msg_invalidUserPassword);
        }
    });
}
