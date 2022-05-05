import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const AccountSchema = new Schema({
  /**
   * @description The email of the account
   */
  account: {
    type: String,
    require: true
  },
  /**
   * @description The nickname of the account
   */
  nickname: {
    type: String
  },
  /**
   * @description The phone of the account
   */
  phone: {
    type: String
  },
  /**
   * @description The client role of the account
   */
  role: {
    type: Array
  },
  /**
   * @description The server role of the account
   */
  currentAuthority: {
    type: String,
    /**
     * @description The default value is 'USER'
     */
    enum: ['SUPER_ADMIN', 'ADMIN', 'USER', 'GUEST'],
    require: true
  } 
}, { collection: 'account', versionKey: false, timestamps: true});

export default mongoose.model('account', AccountSchema);
