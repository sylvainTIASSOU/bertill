const moment = require('moment-timezone');
const fs = require('fs');

const app_debug_mode = true;
const timezone_name = "Asia/Kolkata";
const msg_server_internal_error = "Server Internal Error";

module.exports = {
    ImagePath: () => "http://localhost:3001/img/",

    ThrowHtmlError: (err, res) => {
        Dlog("---------------------------- App is Helpers Throw Crash(" + serverYYYYMMDDHHmmss() + ") -------------------------");
        Dlog(err.stack);

        fs.appendFile('./crash_log/Crash' + serverDateTime('YYYY-MM-DD HH mm ss ms') + '.txt', err.stack, (err) => {
            if (err) {
                Dlog(err);
            }
        });

        if (res) {
            res.json({ 'status': '0', "message": msg_server_internal_error });
            return;
        }
    },

    ThrowSocketError: (err, client, eventName) => {
        Dlog("---------------------------- App is Helpers Throw Crash(" + serverYYYYMMDDHHmmss() + ") -------------------------");
        Dlog(err.stack);

        fs.appendFile('./crash_log/Crash' + serverDateTime('YYYY-MM-DD HH mm ss ms') + '.txt', err.stack, (err) => {
            if (err) {
                Dlog(err);
            }
        });

        if (client) {
            client.emit(eventName, { 'status': '0', "message": msg_server_internal_error });
            return;
        }
    },

    CheckParameterValid: (res, jsonObj, checkKeys, callback) => {
        let isValid = true;
        let missingParameter = "";

        checkKeys.forEach((key) => {
            if (!Object.prototype.hasOwnProperty.call(jsonObj, key)) {
                isValid = false;
                missingParameter += key + " ";
            }
        });

        if (!isValid) {
            if (!app_debug_mode) {
                missingParameter = "";
            }
            res.json({ 'status': '0', "message": "Missing parameter (" + missingParameter + ")" });
        } else {
            return callback();
        }
    },

    CheckParameterValidSocket: (client, eventName, jsonObj, checkKeys, callback) => {
        let isValid = true;
        let missingParameter = "";

        checkKeys.forEach((key) => {
            if (!Object.prototype.hasOwnProperty.call(jsonObj, key)) {
                isValid = false;
                missingParameter += key + " ";
            }
        });

        if (!isValid) {
            if (!app_debug_mode) {
                missingParameter = "";
            }
            client.emit(eventName, { 'status': '0', "message": "Missing parameter (" + missingParameter + ")" });
        } else {
            return callback();
        }
    },

    createRequestToken: () => {
        const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let result = '';
        for (let i = 0; i < 20; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    },

    fileNameGenerate: (extension) => {
        const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let result = '';
        for (let i = 0; i < 10; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return serverDateTime('YYYYMMDDHHmmssms') + result + '.' + extension;
    },

    Dlog: (log) => {
        if (app_debug_mode) {
            console.log(log);
        }
    },

    serverDateTime: (format) => {
        const jun = moment().tz(timezone_name);
        return jun.format(format);
    },

    serverYYYYMMDDHHmmss: () => serverDateTime('YYYY-MM-DD HH:mm:ss')
};

process.on('uncaughtException', (err) => {
    // Gérer les exceptions non capturées si nécessaire
});
