import jwt from 'jsonwebtoken'
import config from '../../config'
import {client} from './redis'
import Account_col from '../models/account'
import log from '../utils/log4js'

class Jwt {
  /**
   * 验证token是否有效
   * @param token JSON Web Token
   * @returns {Promise<string | null>} accountId
   */
  static verify(token: string): Promise<string | null> {
    return new Promise(async (resolve, reject) => {

      // SUPER ADMIN VALIDATE
      if(token === config.secret) {
        try {

          const accountId = await client.get('SUPER_ADMIN')
          if(accountId === null) {

            const superAdmin = await Account_col.findOne({currentAuthority: 'SUPER_ADMIN'}).lean()

            if(superAdmin) {
              await client.set('SUPER_ADMIN', superAdmin._id)
              resolve(superAdmin._id)
            } else {
              resolve(null)
            }
            
          } else {
            resolve(accountId)
          }
        } catch (error) {

          log.error(error)
          resolve(null)
          
        }
        
        return
      }

      jwt.verify(token, config.secret, async (err, data) => {
        if(err) {
          reject(null); // jwt未查询到token
          return;
        }
        // 根据token查询accountId
        try {
          const accountId = await client.get(token)
          resolve(accountId)
        } catch (error) {
          reject(null)
        }
      })
    })
  }

  /**
   * 生成jsonwebtoken
   * @returns Synchronously sign the given payload into a JSON Web Token string payload - Payload to sign, could be an literal, buffer or string secretOrPrivateKey - Either the secret for HMAC algorithms, or the PEM encoded private key for RSA and ECDSA. [options] - Options for the signature returns - The JSON Web Token string
   */
  static sign(payload: string | object | Buffer, options: jwt.SignOptions | undefined) {
    return jwt.sign(payload, config.secret, options);
  }

  /**
   * 通过token获取accountId
   * @param {String} token JSON Web Token
   * @returns {Promise<String | null>} accountId
   */
  static getAccountId(token: string | string[] | undefined): Promise<string | null> {
    return new Promise((resolve, reject) => {
      if(typeof token === 'string') {
        Jwt.verify(token).then(accountId => {
          resolve(accountId)
        }).catch(err => {
          resolve(null)
        })
      } else {
        resolve(null)
      }
    })
    
  }
}

export default Jwt