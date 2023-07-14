const Config = require('config');
const kcConfig = Config.get('keycloak');
var rp = require('request-promise');
var jsonwebtoken = require('jsonwebtoken');

function rsaPublicKeyPem(modulus_b64, exponent_b64) {
 
    var modulus = Buffer.from(modulus_b64, 'base64');
    var exponent = Buffer.from(exponent_b64, 'base64');
  
    var modulus_hex = modulus.toString('hex')
    var exponent_hex = exponent.toString('hex')
  
    modulus_hex = prepadSigned(modulus_hex)
    exponent_hex = prepadSigned(exponent_hex)
  
    var modlen = modulus_hex.length/2
    var explen = exponent_hex.length/2
  
    var encoded_modlen = encodeLengthHex(modlen)
    var encoded_explen = encodeLengthHex(explen)
    var encoded_pubkey = '30' + 
        encodeLengthHex(
            modlen + 
            explen + 
            encoded_modlen.length/2 + 
            encoded_explen.length/2 + 2
        ) + 
        '02' + encoded_modlen + modulus_hex +
        '02' + encoded_explen + exponent_hex;
  
    var der_b64 = Buffer.from(encoded_pubkey, 'hex').toString('base64');
  
    var pem = '-----BEGIN RSA PUBLIC KEY-----\n' 
        + der_b64.match(/.{1,64}/g).join('\n') 
        + '\n-----END RSA PUBLIC KEY-----\n';
  
    return pem
  }
  
  function prepadSigned(hexStr) {
    var msb = hexStr[0]
    if (msb < '0' || msb > '7') {
        return '00'+hexStr;
    } else {
        return hexStr;
    }
  }
  
  function toHex(number) {
    var nstr = number.toString(16);
    if (nstr.length%2) return '0'+nstr;
    return nstr;
  }
  
  // encode ASN.1 DER length field
  // if <=127, short form
  // if >=128, long form
  function encodeLengthHex(n) {
    if (n<=127) return toHex(n)
    else {
        var n_hex = toHex(n)
        var length_of_length_byte = 128 + n_hex.length/2 // 0x80+numbytes
        return toHex(length_of_length_byte)+n_hex
    }
  }

  const fetchKeycloakPublicKeys = async () => {    
    var serverUrl = process.env.KEYCLOAK_URL;
    var realm = process.env.KEYCLOAK_REALM;
    if(!serverUrl) {
      serverUrl = kcConfig.serverUrl;
    }
    if(!realm) {
      realm = kcConfig.realm;
    }
  
    let url = serverUrl + '/auth/realms/' + realm + "/protocol/openid-connect/certs";
    let options = {
      method: 'GET',
      url: url,
      json: true,
      insecure: true,
      rejectUnauthorized: false
    };
    let r = await rp(options);  
    global.KEYCLOAK_PUBLIC_KEY = r;
    return r;
  }

  exports.fetchKeycloakPublicKeys = fetchKeycloakPublicKeys;
  
  const getKeycloakPublicKeys = async () => {
    if(global.KEYCLOAK_PUBLIC_KEY) return global.KEYCLOAK_PUBLIC_KEY;    
    return await fetchKeycloakPublicKeys();
  }

  exports.verifyKeycloakToken = async (token) => {
    let certs = await getKeycloakPublicKeys();
    if(certs && certs.keys && certs.keys.length > 0) {
        for(let i=0; i<certs.keys.length; i++) {
            try {
                let cert = certs.keys[i];
                //console.log(cert);
                
                let pem = rsaPublicKeyPem(cert.n, cert.e);
                
                //console.log(pem);
                var decryptedData = jsonwebtoken.verify(token, pem, { algorithms: ['RS256'] });                    
        
                //console.log(decryptedData);
                return decryptedData;
            } catch (e) {
                //console.log(e);
            }
        }
        
    }
    return undefined;
    
  }