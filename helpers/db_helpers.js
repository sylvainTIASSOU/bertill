const mysql = require('mysql');
const config = require('config');
const helper = require('./helpers');

const dbConfig = config.get('dbConfig');
let db = mysql.createConnection(dbConfig);

if (config.has('optionalFeature.detail')) {
    const detail = config.get('optionalFeature.detail');
    helper.Dlog('config: ' + detail);
}

reconnect(db, () => {});

function reconnect(connection, callback) {
    helper.Dlog("\n New connection attempt ... (" + helper.serverYYYYMMDDHHmmss() + ")");

    connection = mysql.createConnection(dbConfig);
    connection.connect((err) => {
        if (err) {
            helper.ThrowHtmlError(err);

            setTimeout(() => {
                helper.Dlog('----------------- DB Reconnecting Error (' + helper.serverYYYYMMDDHHmmss() + ') ....................');
                reconnect(connection, callback);
            }, 5000);
        } else {
            helper.Dlog('\n\t ----- New Connection established with database. -------');
            db = connection;
            return callback();
        }
    });

    connection.on('error', (err) => {
        helper.Dlog('----- App connection crashed in DB Helper (' + helper.serverYYYYMMDDHHmmss() + ') -------');

        switch (err.code) {
            case "PROTOCOL_CONNECTION_LOST":
                helper.Dlog("/!\\ PROTOCOL_CONNECTION_LOST Cannot establish a connection with the database. /!\\ (" + err.code + ")");
                reconnect(connection, callback);
                break;
            case "PROTOCOL_ENQUEUE_AFTER_QUIT":
                helper.Dlog("/!\\ PROTOCOL_ENQUEUE_AFTER_QUIT Cannot establish a connection with the database. /!\\ (" + err.code + ")");
                reconnect(connection, callback);
                break;
            case "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR":
                helper.Dlog("/!\\ PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR Cannot establish a connection with the database. /!\\ (" + err.code + ")");
                reconnect(connection, callback);
                break;
            case "PROTOCOL_ENQUEUE_HANDSHAKE_TWICE":
                helper.Dlog("/!\\ PROTOCOL_ENQUEUE_HANDSHAKE_TWICE Cannot establish a connection with the database. /!\\ (" + err.code + ")");
                reconnect(connection, callback);
                break;
            case "ECONNREFUSED":
                helper.Dlog("/!\\ ECONNREFUSED Cannot establish a connection with the database. /!\\ (" + err.code + ")");
                reconnect(connection, callback);
                break;
            case "PROTOCOL_PACKETS_OUT_OF_ORDER":
                helper.Dlog("/!\\ PROTOCOL_PACKETS_OUT_OF_ORDER Cannot establish a connection with the database. /!\\ (" + err.code + ")");
                reconnect(connection, callback);
                break;
            default:
                throw err;
        }
    });
}

module.exports = {
    query: (sqlQuery, args, callback) => {
        if (db.state === 'authenticated' || db.state === "connected") {
            db.query(sqlQuery, args, (error, result) => {
                return callback(error, result);
            });
        } else {
            reconnect(db, () => {
                db.query(sqlQuery, args, (error, result) => {
                    return callback(error, result);
                });
            });
        }
    }
};

process.on('uncaughtException', (err) => {
    helper.Dlog('------------------------ App crashed in DB helper (' + helper.serverYYYYMMDDHHmmss() + ') -------------------------');
    helper.Dlog(err.code);
    helper.ThrowHtmlError(err);
});
