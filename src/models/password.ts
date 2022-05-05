import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const PasswordSchema = new Schema({
  /**
   * @description model.account._id
   */
  accountId: {
    type: String,
    unique: true,
    required: true
  },
  /**
   * @description The hash password of the account
   */
  hash: {
    type: String,
    required: true
  }
}, { collection: 'password', versionKey: false});

export default mongoose.model('password', PasswordSchema);
