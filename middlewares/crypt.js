const crypto = require("crypto-js");

var password = process.env['CRYPT_PASSWORD'];

async function encode(data) {
    var key = password;
    if (typeof data !== 'string') {
        data = String(data); 
    }
    var encrypted = crypto.AES.encrypt(data, key).toString();
    return encrypted;
}


async function decode(data) {
    var key = password;
    var bytes = crypto.AES.decrypt(data, key);
    var originalText = bytes.toString(crypto.enc.Utf8);
    return originalText;
}

module.exports = { encode, decode };
