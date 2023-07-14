const crypto = require('crypto-js');

class Util {
    constructor() {}

    // Function to add ($addDate) days to input date
    static addDate(s, addDate) {
        if (s != undefined && s != null) {
            var parts = s.split('-');
            // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
            // January - 0, February - 1, etc.
            var date;
            if (addDate == undefined || addDate == null) {
                date = new Date(parts[0], parts[1] - 1, parts[2]);
            } else {
                date = new Date(parts[0], parts[1] - 1, parts[2]);
                date = new Date(date.setTime( date.getTime() + addDate * 86400000 ));
            }
            var tzoffset = (date).getTimezoneOffset() * 60000; //offset in milliseconds
            var localISOTime = (new Date(date - tzoffset)).toISOString().slice(0, -1);
            return localISOTime;
        }
    }

    static encrypt(message, key) {
      let iv = crypto.lib.WordArray.random(16);
      let k = crypto.enc.Hex.parse(key);
      //console.log(k);
      let encrypted = crypto.AES.encrypt(message, k, {iv: iv});
      //console.log(encrypted.toString());
      let result = {
        ct: encrypted.ciphertext.toString(crypto.enc.Base64),
        //ct: crypto.enc.Hex.stringify(encrypted.ciphertext),
        iv: crypto.enc.Hex.stringify(encrypted.iv),
        //s: encrypted.salt.toString(),
      };
      console.log(result);
      return JSON.stringify(result);
    }

    static decrypt(message, key) {
      let encrypted = JSON.parse(message);
      let k = crypto.enc.Hex.parse(key);
      //console.log(encrypted);
      let ct = crypto.enc.Base64.parse(encrypted.ct);
      console.log(crypto.enc.Hex.stringify(ct))
      //let ct = crypto.enc.Hex.parse(encrypted.ct);
      let iv = crypto.enc.Hex.parse(encrypted.iv);
      //let s = crypto.enc.Hex.parse(encrypted.s);
      let decrypted = crypto.enc.Utf8.stringify(crypto.AES.decrypt({
        ciphertext: ct
      }, k, {iv: iv}));
      console.log(decrypted);
      return (decrypted);
    }
}
module.exports = Util;
