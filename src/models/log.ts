import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const LogSchema = new Schema({
  /**
   * @description client ip
   */
  ip: {
    type: String,
    require: true
  },
  /**
   * @description client user agent
   */
  userAgent: {
    type: String,
    require: true
  },
  /**
   * @description http status code
   */
  statusCode: {
    type: Number,
    require: true
  },
  /**
   * @description request method
   */
  method: {
    type: String,
    require: true
  },
  /**
   * @description request route path
   */
  route: {
    type: String,
    require: true
  },
  /**
   * @description referer host
   */
  host: {
    type: String
  },
  /**
   * @description referer protocol
   */
  protocol: {
    type: String
  },
  /**
   * @description model.account._id
   */
  accountId: {
    type: String
  },
  /**
   * @description about log infomation
   */
  info: {
    type: String
  },
  /**
   * @description request query
   */
  query: {
    type: String,
  },
  /**
   * @description request body
   */
  body: {
    type: Object
  },
  /**
   * @description server responese
   */
  responese: {
    type: Object
  },
  /**
   * @description current packages.json version
   */
  version: {
    type: String
  }
}, { collection: 'log', versionKey: false, timestamps: { updatedAt: false}});

export default mongoose.model('log', LogSchema);
