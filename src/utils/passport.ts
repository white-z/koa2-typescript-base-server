// https://www.npmjs.com/package/bcrypt
import bcrypt from 'bcrypt';
import config from '../../config'
/**
 * 密码加密
 * @param password 未加密密码 
 * @returns {Promise<string>} 加密后的密码
 */
const encrypt = async (password: string | Buffer): Promise<string> => {
  const hash = await bcrypt.hash(password, config.saltTimes);
  return hash;
};

/**
 * 验证密码
 * @param password 未加密密码
 * @param hash 加密后的密码
 * @returns {Promise<boolean>} 是否匹配
 */
const validate = async (password: string | Buffer, hash: string): Promise<boolean> => {
  const match = await bcrypt.compare(password, hash);
  return match;
};

/**
 * 验证密码和密码加密
 */
export default {
  encrypt,
  validate
}
