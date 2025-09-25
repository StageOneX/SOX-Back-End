const crypto = require("crypto-js");

var password = process.env['CRYPT_PASSWORD'];

async function encode(string) {
    var key = password;
    var encrypted = crypto.AES.encrypt(string, key).toString();
    return encrypted;
}

async function decode(string) {
    var key = password;
    var bytes = crypto.AES.decrypt(string, key);
    var originalText = bytes.toString(crypto.enc.Utf8);
    return originalText;
}

module.exports = { encode, decode };
