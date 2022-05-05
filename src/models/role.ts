import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const RoleSchema = new Schema({
  roleId: {
    type: String,
    unique: true,
    require: true
  },
  name: {
    type: String
  }
}, { collection: 'role', versionKey: false});

export default mongoose.model('role', RoleSchema);
