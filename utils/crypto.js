import crypto from 'crypto'

const CRYPTO_KEY = '123'
// 加密
function aesEncrypt(data, key) {
  let cipher = crypto.createCipher('aes192', key)
  let crypted = cipher.update(data, 'utf8', 'hex')
  return cipher.final('hex')
}

// 解码
function aesDecrypt(encrypt, key) {
  let decipher = crypto.createDecipher('aes192', key);
  let decrypted = decipher.update(encrypt, 'hex', 'utf8');
  return decipher.final('utf8');
}

export const encrypt = str => aesEncrypt(str,CRYPTO_KEY)
export const decrypt = str => aesDecrypt(str, CRYPTO_KEY)

export const encryptJson = json => {
    return json.replace(/(\"url\":\")(.*?)(\")/g,(match,p1,p2,p3)=>{
        return p1+'/static/'+ encrypt(p2) +p3
    })
}