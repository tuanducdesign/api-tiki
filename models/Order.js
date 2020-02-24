const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  cart: [],
  address: { type: String, required: true },
  phoneNo: { type: String, required: true },
  name: { type: String, required: true },
  total: { type: Number, required: true },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Order', orderSchema);
